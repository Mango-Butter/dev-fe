// src/routes/PublicRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useUserStore } from "../stores/userStore.ts";
import FullScreenLoading from "../components/common/FullScreenLoading.tsx";

const PublicRoute = () => {
  const { isLoggedIn, isLoading } = useAuth();
  const user = useUserStore((state) => state.user);

  if (isLoading) return <FullScreenLoading />;

  if (!isLoggedIn) return <Outlet />;

  switch (user?.role) {
    case "BOSS":
      return <Navigate to="/boss" replace />;
    case "STAFF":
      return <Navigate to="/staff" replace />;
    case "ADMIN":
      return <Navigate to="/admin" replace />;
    default:
      return <Navigate to="/signup" replace />;
  }
};

export default PublicRoute;
