import ProfileOptions from "./profile/AvatarDropdownMenu";
import { useNavigate } from "react-router";
import { useAuth } from "@/contexts/auth/AuthContext";

const Menu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const goToSettings = () => navigate("settings");
  const handleLogout = async () => await logout();
  const goToMyEvents = () => navigate("my-events");
  const goToPermissions = () => navigate("permissions");

  const profileOptions = [
    ...(user?.role === "admin"
      ? [
          { value: "my-events", label: "My Created Events", action: goToMyEvents },
          { value: "permissions", label: "User Permissions", action: goToPermissions },
        ]
      : []),
    { value: "notification", label: "Notification Settings", action: goToSettings },
    { value: "logout", label: "Logout", action: handleLogout },
  ];

  return (
    <div className="h-16 bg-pink-100 w-full flex justify-between items-center gap-3 px-4 md:px-8 py-3 border-b border-pink-300">
      <h1
        className="text-2xl md:text-3xl font-bold text-black cursor-pointer"
        onClick={() => navigate("/")}
      >
        EventMate
      </h1>

      {/* Opcional: espacio para links centrales si quieres agregar más */}
      <ul className="hidden md:flex gap-6 flex-1 justify-center">
        {/* Puedes agregar links aquí si es necesario */}
      </ul>

      <div className="hidden md:block">
        <ProfileOptions options={profileOptions} name={user?.displayName || "John Doe"} />
      </div>
    </div>
  );
};

export default Menu;
