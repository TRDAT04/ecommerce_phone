import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function ProtectedRouteAdmin({ children }) {
  const user = useAuthStore((s) => s.user);

  if (!user) return <Navigate to="/login" />;

  if (user.role !== "ROLE_ADMIN" && user.role !== "ROLE_SUPER_ADMIN") return <Navigate to="/" />;

  return children;
}