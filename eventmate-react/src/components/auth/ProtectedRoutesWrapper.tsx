import { useAuth } from "@/contexts/auth/AuthContext";
import { Navigate, Outlet } from "react-router";
import Loader from "../ui/Loader";
import type { ReactNode } from "react";

interface ProtectedRoutesWrapperProps {
  children: ReactNode;
}

const ProtectedRoutesWrapper = ({ children }: ProtectedRoutesWrapperProps) => {
  const { user, loading } = useAuth();

  console.log(loading);
  if (loading) {
    return <Loader />;
  }


  if (!user) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      {children}
      <Outlet />
    </>
  );
};

export default ProtectedRoutesWrapper;
