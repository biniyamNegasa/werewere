import { create } from "zustand";
import axios from "axios";
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
  chatSubscription: null,
  csrfToken: null,
  presence: {},

  // --- ACTIONS ---
  syncProps: (props) => {
    const { chats, contacts, auth, preselectedChat, flash, csrf } = props;

    set({
      chats: chats || [],
      contacts: contacts || [],
      currentUser: auth.user,
      csrfToken: csrf?.token || get().csrfToken,
      activeChatId: preselectedChat
        ? preselectedChat.id
        : flash?.active_chat_id || get().activeChatId,
    });

    if (!get().chatListSubscription) {
      get().subscribeToChatList();
    }

    const { activeChatId, chatSubscription } = get();
    if (activeChatId && !chatSubscription) {
      get().subscribeToChat(activeChatId);
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

  // One persistent subscription for the chat being viewed; it delivers new
  // messages instantly and carries read receipts both ways.
  subscribeToChat: (chatId) => {
    get().chatSubscription?.unsubscribe();

    const subscription = get().cable.subscriptions.create(
      { channel: "ChatChannel", id: chatId },
      {
        received: (data) => {
          if (data.type === "new_message") {
            get().handleIncomingMessage(chatId, data.message);
          } else if (data.type === "messages_read") {
            get().handleMessagesRead(chatId, data);
          }
        },
      },
    );
    set({ chatSubscription: subscription });
  },

  addNewChat: (newChat) => {
    set((state) => {
      if (state.chats.some((chat) => chat.id === newChat.id)) return {};
      return { chats: [newChat, ...state.chats] };
    });
  },

  handleIncomingMessage: (chatId, message) => {
    if (!message || !message.id) return;

    set((state) => {
      const targetChat = state.chats.find((c) => c.id === chatId);
      if (!targetChat) return {};
      if (targetChat.messages.some((msg) => msg.id === message.id)) return {};

      const updatedChat = {
        ...targetChat,
        last_message: message,
        messages: [...targetChat.messages, message],
      };
      return {
        chats: state.chats.map((c) => (c.id === chatId ? updatedChat : c)),
      };
    });

    // Viewing the chat means the message is read the moment it arrives.
    const { activeChatId, currentUser } = get();
    if (activeChatId === chatId && message.user_id !== currentUser?.id) {
      get().markChatRead(chatId);
    }
  },

  handleMessagesRead: (chatId, { reader_id, read_at }) => {
    set((state) => {
      const targetChat = state.chats.find((c) => c.id === chatId);
      if (!targetChat) return {};

      const messages = targetChat.messages.map((msg) =>
        msg.user_id !== reader_id && !msg.read_at ? { ...msg, read_at } : msg,
      );
      const last_message =
        targetChat.last_message &&
        targetChat.last_message.user_id !== reader_id &&
        !targetChat.last_message.read_at
          ? { ...targetChat.last_message, read_at }
          : targetChat.last_message;

      return {
        chats: state.chats.map((c) =>
          c.id === chatId ? { ...c, messages, last_message } : c,
        ),
      };
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

  // Fire-and-forget: tells the server everything up to now is read without
  // triggering an Inertia page reload.
  markChatRead: (chatId) => {
    const token = get().csrfToken;
    axios
      .patch(
        update_last_read_participants_path(),
        { chat_id: chatId },
        { headers: token ? { "X-CSRF-Token": token } : {} },
      )
      .catch((error) => console.error("Failed to mark chat as read:", error));
  },

  setActiveChat: (chatId) => {
    set({ activeChatId: chatId });

    if (chatId) {
      set((state) => ({
        chats: state.chats.map((c) =>
          c.id === chatId ? { ...c, unread_count: 0 } : c,
        ),
      }));

      get().subscribeToChat(chatId);
      get().markChatRead(chatId);
    } else {
      get().chatSubscription?.unsubscribe();
      set({ chatSubscription: null });
    }
  },

  setPresence: (presence) => {
    set({ presence });
  },

  speak: (messageBody) => {
    const { chatSubscription } = get();
    if (messageBody.trim() && chatSubscription) {
      chatSubscription.perform("speak", { message: messageBody });
    }
  },
}));
