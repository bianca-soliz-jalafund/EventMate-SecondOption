import { useState, useEffect } from "react";
import { userConfigurationRepository } from "@lib/repositories/implementations/UserConfigurationRepository";
import UserConfiguration, { type UserRole } from "@lib/models/UserConfiguration";
import { ShieldCheck, User, Loader2, Users, UserX } from "lucide-react";

const PermissionsPage = () => {
  const [users, setUsers] = useState<UserConfiguration[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const usersData = await userConfigurationRepository.getUsersConfigurations();
        setUsers(usersData);
      } catch (error) {
        console.error("Error loading users:", error);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  const handleRoleChange = async (userId: string, currentRole: UserRole) => {
    try {
      setUpdatingUser(userId);
      const newRole: UserRole = currentRole === "admin" ? "user" : "admin";

      await userConfigurationRepository.changeRole(userId, newRole);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.userId === userId
            ? new UserConfiguration(
                user.email,
                user.userId,
                newRole,
                user.id,
                user.isEnableNotifications
              )
            : user
        )
      );
    } catch (error) {
      console.error("Error updating user role:", error);
    } finally {
      setUpdatingUser(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center text-pink-600">
        <Loader2 className="h-12 w-12 animate-spin" />
        <p className="mt-4 text-lg font-medium">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-black" />
            <h1 className="text-3xl font-bold text-black">
              User Management
            </h1>
          </div>
          <p className="mt-1 text-md text-pink-500">
            Manage roles and permissions for all users in the system.
          </p>
        </div>

        {/* Lista de usuarios */}
        <div className="space-y-4">
          {users.length > 0 ? (
            users.map((user) => (
              <div
                key={user.userId}
                className="bg-white border border-pink-200 rounded-xl p-6 shadow-md flex items-center justify-between transition-shadow hover:shadow-pink-300/50"
              >
                {/* Info del usuario */}
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-full ${
                      user.role === "admin"
                        ? "bg-pink-100 text-pink-600"
                        : "bg-pink-50 text-pink-400"
                    }`}
                  >
                    {user.role === "admin" ? (
                      <ShieldCheck className="h-6 w-6" />
                    ) : (
                      <User className="h-6 w-6" />
                    )}
                  </div>
                  <div>
                    <p className="text-md font-semibold text-zinc-600">
                      {user.email}
                    </p>
                    <p className="text-sm text-pink-500">
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </p>
                  </div>
                </div>

                {/* Botón de acción */}
                <button
                  onClick={() => handleRoleChange(user.userId, user.role)}
                  disabled={updatingUser === user.userId}
                  className={`flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed min-w-[150px] ${
                    user.role === "admin"
                      ? "bg-pink-200 text-pink-700 hover:bg-pink-300"
                      : "bg-pink-600 text-white hover:bg-pink-700"
                  }`}
                >
                  {updatingUser === user.userId ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : user.role === "admin" ? (
                    "Change to User"
                  ) : (
                    "Change to Admin"
                  )}
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white border border-pink-200 rounded-xl">
              <UserX className="mx-auto h-12 w-12 text-pink-400" />
              <h3 className="mt-2 text-lg font-medium text-pink-700">
                No Users Found
              </h3>
              <p className="mt-1 text-sm text-pink-500">
                There are no users to display at the moment.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PermissionsPage;
