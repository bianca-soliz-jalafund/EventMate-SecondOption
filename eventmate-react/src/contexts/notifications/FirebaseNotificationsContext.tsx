import { getToken, onMessage, type MessagePayload } from "firebase/messaging";
import { messaging } from "@config/firebase.config";
import { useEffect, useState, createContext, useContext } from "react";
import { useAuth } from "@/contexts/auth/AuthContext";
import notificationHandler from "./NotificationHandler";
import { userConfigurationRepository } from "@lib/repositories/implementations/UserConfigurationRepository";

export interface FirebaseNotificationsContextValue {
  token: string | null;
  isLoading: boolean;
  error: string | null;
  askPermission: boolean;
  setAskPermission: (value: boolean) => void;
  requestPermission: () => Promise<void>;
}

const FirebaseNotificationsContext = createContext<
  FirebaseNotificationsContextValue | undefined
>(undefined);

const VAPID_KEY = import.meta.env.VITE_VAPID_KEY;

export const FirebaseNotificationsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useAuth();

  const [token, setToken] = useState<string | null>(null);
  const [askPermission, setAskPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestPermission = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!VAPID_KEY) {
        throw new Error("VAPID key not found in .env");
      }
      console.log("VAPID_KEY", VAPID_KEY);

      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        throw new Error("Push notifications not supported in this browser");
      }

      const permission = await Notification.requestPermission();

      if (permission !== "granted") {
        throw new Error(
          `Permission ${permission}. Please allow notifications.`
        );
      }
      console.log("Permission granted");
      const fcmToken = await getToken(messaging, { vapidKey: VAPID_KEY });
      console.log("FCM Token:", fcmToken);
      if (fcmToken && user) {
        setToken(fcmToken);
        await userConfigurationRepository.setDeviceToken(user.uid, fcmToken);
      } else {
        throw new Error("Failed to get FCM token.");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      console.error("FCM Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user || !token) {
      return;
    }

    const unsubscribe = onMessage(
      messaging,
      async (payload: MessagePayload) => {
        console.log("Mensaje recibido en primer plano:", payload);
        if (payload.data?.type === "bulk") {
          //  setThereAreNewPosts?.(true);
        }
        await notificationHandler(payload);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const value: FirebaseNotificationsContextValue = {
    token,
    isLoading,
    error,
    askPermission,
    setAskPermission,
    requestPermission,
  };

  return (
    <FirebaseNotificationsContext.Provider value={value}>
      {children}
    </FirebaseNotificationsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useFirebaseNotifications = () => {
  const context = useContext(FirebaseNotificationsContext);
  if (!context) {
    throw new Error(
      "useFirebaseNotifications debe ser usado dentro de un FirebaseNotificationsProvider"
    );
  }
  return context;
};
