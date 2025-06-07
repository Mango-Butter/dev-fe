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

  const role = user?.role;

  // 아직 가입 절차가 끝나지 않은 사용자
  if (role === "UNASSIGNED" && location.pathname !== "/signup") {
    return <Navigate to="/signup" replace />;
  }

  // 가입완료 후 /signup에 접근 시 해당 역할 메인으로 리다이렉트
  if (location.pathname === "/signup") {
    switch (role) {
      case "BOSS":
        return <Navigate to="/boss" replace />;
      case "STAFF":
        return <Navigate to="/staff" replace />;
      case "ADMIN":
        return <Navigate to="/admin" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
