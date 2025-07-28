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
  initialize: (initialData) => {
    const { chats, contacts, auth, preselectedChat } = initialData;
    set({
      chats: chats || [],
      contacts: contacts || [],
      currentUser: auth.user,
      activeChatId: preselectedChat?.id || null,
    });
    get().subscribeToChatList();
  },

  subscribeToChatList: () => {
    const cable = get().cable;
    const subscription = cable.subscriptions.create(
      { channel: "ChatListChannel" },
      {
        received: (data) => {
          if (data.type === "chat_list_update") {
            get().handleChatUpdate(data);
          }
        },
      },
    );
    set({ chatListSubscription: subscription });
  },

  handleChatUpdate: (data) => {
    const newMessage = data.last_message;
    if (!newMessage || !newMessage.id) return;

    set((state) => ({
      chats: state.chats.map((chat) => {
        if (chat.id === data.chat_id) {
          const messageExists = chat.messages.some(
            (msg) => msg.id === newMessage.id,
          );
          const newUnreadCount =
            get().activeChatId === data.chat_id ? 0 : data.unread_count;

          return {
            ...chat,
            last_message: newMessage,
            unread_count: newUnreadCount,
            messages: messageExists
              ? chat.messages
              : [...chat.messages, newMessage],
          };
        }
        return chat;
      }),
    }));
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
