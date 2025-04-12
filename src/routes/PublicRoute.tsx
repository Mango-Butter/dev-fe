// src/routes/PublicRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const PublicRoute = () => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) return <div>로딩 중...</div>;

  return isLoggedIn ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;
