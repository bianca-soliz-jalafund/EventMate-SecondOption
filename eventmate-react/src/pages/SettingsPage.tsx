import NotificationsSettings from "@/components/settings/NotificationsSettings";
import { CenterContainer } from "@/components/ui/Container";

const SettingsPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-100/50 ">
      <CenterContainer className="flex-col">
        <div className="max-w-md w-full bg-white backdrop-blur-md rounded-xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">Settings</h1>
          </div>
          <NotificationsSettings />
        </div>
      </CenterContainer>
    </div>
  );
};

export default SettingsPage;
