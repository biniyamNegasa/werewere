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
          if (data.type === "presence_snapshot") {
            // Initial state of everyone this user can see.
            setUsersPresence((prevPresence) => {
              const next = { ...prevPresence };
              data.users.forEach((user) => {
                next[user.id] = {
                  status: user.status,
                  last_seen_at: user.last_seen_at,
                };
              });
              return next;
            });
          } else {
            // Update the presence map for the specific user
            setUsersPresence((prevPresence) => ({
              ...prevPresence,
              [data.user_id]: {
                status: data.status,
                last_seen_at: data.last_seen_at,
              },
            }));
          }
        },
      },
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array means this runs once on mount

  return usersPresence; // Return the map of all users' presence
}
