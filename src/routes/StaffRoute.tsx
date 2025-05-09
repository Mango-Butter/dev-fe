// src/routes/StaffRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useUserStore } from "../stores/userStore";

const StaffRoute = () => {
  const { isLoggedIn, isLoading } = useAuth();
  const user = useUserStore((state) => state.user);

  if (isLoading) return <div>로딩 중...</div>;

  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (user?.role !== "STAFF") return <Navigate to="/" replace />;

  return <Outlet />;
};

export default StaffRoute;
