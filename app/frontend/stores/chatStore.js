import { create } from "zustand";
import { router } from "@inertiajs/react";
import { createConsumer } from "@rails/actioncable";
import { update_last_read_participants_path } from "@/routes";

const getCable = () => {
  if (!window.cable) {
    window.cable = createConsumer();
  }
  return window.cable;
};

export const useChatStore = create((set, get) => ({
  // --- STATE ---
  chats: [],
  contacts: [],
  currentUser: null,
  activeChatId: null,
  cable: getCable(),
  chatListSubscription: null,

  // --- ACTIONS ---
  syncProps: (props) => {
    const { chats, contacts, auth, preselectedChat, flash } = props;

    set({
      chats: chats || [],
      contacts: contacts || [],
      currentUser: auth.user,
      activeChatId: preselectedChat
        ? preselectedChat.id
        : flash?.active_chat_id || get().activeChatId,
    });

    if (!get().chatListSubscription) {
      get().subscribeToChatList();
    }
  },

  subscribeToChatList: () => {
    const cable = get().cable;
    const subscription = cable.subscriptions.create(
      { channel: "ChatListChannel" },
      {
        received: (data) => {
          if (data.type === "new_chat") {
            get().addNewChat(data.chat);
          } else if (data.type === "chat_list_update") {
            get().handleChatUpdate(data);
          }
        },
      },
    );
    set({ chatListSubscription: subscription });
  },

  addNewChat: (newChat) => {
    set((state) => {
      if (state.chats.some((chat) => chat.id === newChat.id)) return {};
      return { chats: [newChat, ...state.chats] };
    });
  },

  handleChatUpdate: (data) => {
    const newMessage = data.last_message;
    if (!newMessage || !newMessage.id) return;

    set((state) => {
      // Find the chat that needs to be updated.
      const targetChat = state.chats.find((c) => c.id === data.chat_id);
      if (!targetChat) return {}; // Do nothing if the chat isn't found

      // Check if the message already exists to prevent duplicates.
      const messageExists = targetChat.messages.some(
        (msg) => msg.id === newMessage.id,
      );

      // Determine the new unread count.
      const newUnreadCount =
        get().activeChatId === data.chat_id ? 0 : data.unread_count;

      // Create the fully updated chat object.
      const updatedChat = {
        ...targetChat,
        last_message: newMessage,
        unread_count: newUnreadCount,
        messages: messageExists
          ? targetChat.messages
          : [...targetChat.messages, newMessage],
      };

      const reorderedChats = [
        updatedChat,
        ...state.chats.filter((c) => c.id !== data.chat_id),
      ];

      return { chats: reorderedChats };
    });
  },

  setActiveChat: (chatId) => {
    set({ activeChatId: chatId });

    if (chatId) {
      set((state) => ({
        chats: state.chats.map((c) =>
          c.id === chatId ? { ...c, unread_count: 0 } : c,
        ),
      }));

      router.patch(
        update_last_read_participants_path(),
        { chat_id: chatId },
        { preserveState: true, preserveScroll: true, only: [] },
      );
    }
  },

  // The 'speak' action now needs to get the subscription differently or be handled elsewhere.
  // A simple approach is to create a short-lived subscription just for sending.
  speak: (messageBody) => {
    const chatId = get().activeChatId;
    if (messageBody.trim() && chatId) {
      const cable = get().cable;
      const subscription = cable.subscriptions.create(
        { channel: "ChatChannel", id: chatId },
        {
          // We only need to connect to send, not to receive.
          connected: () => {
            subscription.perform("speak", { message: messageBody });
            // Unsubscribe immediately after sending to avoid lingering connections.
            subscription.unsubscribe();
          },
        },
      );
    }
  },
}));
