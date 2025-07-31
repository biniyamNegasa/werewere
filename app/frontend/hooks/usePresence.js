import { useEffect, useState } from "react";

export function usePresence() {
  const [usersPresence, setUsersPresence] = useState({}); // { userId: { status: 'online/offline', last_seen_at: 'timestamp' } }

  useEffect(() => {
    if (!window.cable) {
      return;
    }

    const subscription = window.cable.subscriptions.create(
      { channel: "AppearanceChannel" },
      {
        received: (data) => {
          // Update the presence map for the specific user
          setUsersPresence((prevPresence) => ({
            ...prevPresence,
            [data.user_id]: {
              status: data.status,
              last_seen_at: data.last_seen_at,
            },
          }));
        },
      },
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array means this runs once on mount

  return usersPresence; // Return the map of all users' presence
}
