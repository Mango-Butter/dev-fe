import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import AppInitializer from "./routes/AppInitializer.tsx";
import MobileLayout from "./components/layouts/MobileLayout";
import Home from "./pages/Home";
import Schedule from "./pages/Schedule";
import Employees from "./pages/Employees";
import Task from "./pages/Task";
import Store from "./pages/Store";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import LoginSuccess from "./pages/auth/LoginSuccess";

function App() {
  return (
    <Router>
      <AppInitializer />
      <Routes>
        {/* ✅ 로그인 된 사용자만 접근 가능한 라우트 */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MobileLayout />}>
            <Route index element={<Home />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="employees" element={<Employees />} />
            <Route path="task" element={<Task />} />
            <Route path="store" element={<Store />} />
          </Route>
        </Route>

        {/* ✅ 로그인된 사용자는 접근할 수 없는 라우트 (로그인 관련) */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/loginSuccess" element={<LoginSuccess />} />
        </Route>

        {/* ✅ 404 페이지 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
