import { useEffect, useState } from "react";

export function useChatChannel(chatId, onMessageReceived) {
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    if (!chatId) {
      if (subscription) {
        subscription.unsubscribe();
        setSubscription(null);
      }
      return;
    }

    if (!window.cable) {
      console.error("Action Cable consumer (window.cable) is not initialized.");
      return;
    }

    const newSubscription = window.cable.subscriptions.create(
      { channel: "ChatChannel", id: chatId },
      {
        // This callback is triggered when a message is received from the server.
        received: (data) => {
          onMessageReceived(data);
        },
        // Optional: connected, disconnected callbacks for debugging or UI feedback
        connected: () => console.log(`Connected to chat_channel_${chatId}`),
        disconnected: () =>
          console.log(`Disconnected from chat_channel_${chatId}`),
      },
    );

    setSubscription(newSubscription);

    // Cleanup function: unsubscribe when the component unmounts or chatId changes.
    return () => {
      newSubscription.unsubscribe();
      setSubscription(null);
    };
  }, [chatId, onMessageReceived]);

  const speak = (message) => {
    if (subscription) {
      subscription.perform("speak", { message });
    }
  };

  return { speak };
}
