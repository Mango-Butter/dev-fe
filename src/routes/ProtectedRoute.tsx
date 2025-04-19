// src/routes/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useUserStore } from "../stores/userStore";

const ProtectedRoute = () => {
  const { isLoggedIn, isLoading } = useAuth();
  const user = useUserStore((state) => state.user);
  const location = useLocation();

  if (isLoading) return <div>로딩 중...</div>;

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  if (user?.role === "UNASSIGNED" && location.pathname !== "/signup") {
    return <Navigate to="/signup" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
