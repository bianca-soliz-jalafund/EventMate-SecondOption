import { useAuth } from "@/contexts/auth/AuthContext";
import { useFirebaseNotifications } from "@/contexts/notifications/FirebaseNotificationsContext";
import { userConfigurationRepository } from "@lib/repositories/implementations/UserConfigurationRepository";
import { useEffect, useState } from "react";

const NotificationsSettings = () => {
  const { user } = useAuth();
  const { requestPermission } = useFirebaseNotifications();
  const [isPushNotificationsEnabled, setIsPushNotificationsEnabled] =
    useState(false);

  const handleSetPushNotificationState = async () => {
    if (!user?.uid) return;

    const configuration =
      await userConfigurationRepository.getUserConfigurationById(user.uid);
    if (configuration) {
      setIsPushNotificationsEnabled(configuration.isEnableNotifications);
    }
  };

  useEffect(() => {
    handleSetPushNotificationState();
  }, [user?.uid]);

  const togglePushNotifications = async () => {
    if (!user?.uid) return;

    if (isPushNotificationsEnabled) {
      await userConfigurationRepository.toggleNotifications(user.uid, false);
      setIsPushNotificationsEnabled(false);
    } else {
      await requestPermission();
      setIsPushNotificationsEnabled(true);
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-pink-300 bg-opacity-30 backdrop-blur-xl rounded-3xl shadow-lg space-y-6">
      <h2 className="text-3xl font-bold text-pink-800 text-center">
        Notification Settings
      </h2>

      <div className="flex items-center justify-between bg-white/20 backdrop-blur-sm p-5 rounded-2xl shadow-inner">
        <div>
          <h3 className="text-xl font-semibold text-pink-100">
            Push Notifications
          </h3>
          <p className="text-sm text-zinc-500">
            Enable or disable browser push notifications.
          </p>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isPushNotificationsEnabled}
            onChange={togglePushNotifications}
            className="sr-only"
          />
          <div
            className={`w-14 h-7 rounded-full transition-colors duration-300 ${
              isPushNotificationsEnabled ? "bg-pink-600" : "bg-pink-800"
            }`}
          />
          <div
            className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
              isPushNotificationsEnabled ? "translate-x-7" : "translate-x-0"
            } flex items-center justify-center text-pink-600 font-bold`}
          >
            {isPushNotificationsEnabled ? "✔" : "✕"}
          </div>
        </label>
      </div>

      {isPushNotificationsEnabled && (
        <p className="text-center text-pink-50 font-medium">
          You're all set! 
        </p>
      )}
    </div>
  );
};

export default NotificationsSettings;
