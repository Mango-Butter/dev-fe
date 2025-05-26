// src/routes/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useUserStore } from "../stores/userStore";
import FullScreenLoading from "../components/common/FullScreenLoading.tsx";

const ProtectedRoute = () => {
  const { isLoggedIn, isLoading } = useAuth();
  const user = useUserStore((state) => state.user);
  const location = useLocation();

  if (isLoading) return <FullScreenLoading />;

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  if (user?.role === "UNASSIGNED" && location.pathname !== "/signup") {
    return <Navigate to="/signup" replace />;
  }

  if (user?.role === "BOSS" && location.pathname === "/signup") {
    return <Navigate to="/boss" replace />;
  } else if (user?.role === "STAFF" && location.pathname === "/signup") {
    return <Navigate to="/staff" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
