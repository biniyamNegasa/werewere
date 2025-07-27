import { useEffect } from "react";

export function useChatListChannel(currentUserId, onChatListUpdate) {
  useEffect(() => {
    if (!currentUserId || !window.cable) return;

    const subscription = window.cable.subscriptions.create(
      { channel: "ChatListChannel" },
      {
        received: (data) => {
          if (data.type === "chat_list_update") {
            onChatListUpdate(data);
          }
        },
        connected: () => console.log("Connected to ChatListChannel"),
        disconnected: () => console.log("Disconnected from ChatListChannel"),
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [currentUserId, onChatListUpdate]);
}
