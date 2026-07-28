import { Navigate, Outlet } from "react-router";
import useAuthStore from "../store";

export const ProtectedRoute = ({
  allowedRoles,
}: {
  allowedRoles: ["PATIENT" | "ADMIN" | "DOCTOR" | null];
}) => {
  const { role, userInfo } = useAuthStore((state) => state.login);

  if (!role && !userInfo) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />; // Renders the nested child components safely
};
