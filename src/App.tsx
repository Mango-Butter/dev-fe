import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import AppInitializer from "./routes/AppInitializer.tsx";
import MobileLayout from "./components/layouts/MobileLayout";
import Home from "./pages/Home";
// import Schedule from "./pages/schedule/Schedule.tsx";
import Employees from "./pages/Employees";
import Task from "./pages/Task";
import Store from "./pages/Store";
import NotFound from "./pages/NotFound";
import LoginSuccess from "./pages/auth/LoginSuccess.tsx";
import Login from "./pages/auth/Login.tsx";
import Signup from "./pages/signup/Signup.tsx";
import StoreRegisterPage from "./pages/store/StoreRegisterPage.tsx";
import AddressSearchPopup from "./pages/store/AddressSearchPopup.tsx";
import ContractPage from "./pages/contract/Contract.tsx";
import ContractRegisterPage from "./pages/contract/ContractRegisterPage.tsx";
import ContractDetailPage from "./pages/contract/ContractDetailPage.tsx";
import ContractWritePage from "./pages/contract/ContractWritePage.tsx";

//Todo: 추후 페이지 별 Lazy Loading 적용 예정
function App() {
  return (
    <Router>
      <AppInitializer />
      <Routes>
        <Route path="/" element={<MobileLayout />}>
          {/* ✅ 로그인 된 사용자만 접근 가능한 라우트 */}
          <Route element={<ProtectedRoute />}>
            <Route index element={<Home />} />
            {/*<Route path="schedule" element={<Schedule />} />*/}
            <Route path="employees" element={<Employees />} />
            <Route path="task" element={<Task />} />
            <Route path="store" element={<Store />} />
            <Route path="/signup" element={<Signup />} />
            {/*매장등록*/}
            <Route path="/store/register" element={<StoreRegisterPage />} />
            <Route path="/address-search" element={<AddressSearchPopup />} />
            {/*  근로계약서*/}
            <Route path="/contract" element={<ContractPage />} />
            <Route
              path="/contract/register"
              element={<ContractRegisterPage />}
            />
            <Route path="/contract/:id" element={<ContractDetailPage />} />
            <Route path="/contract/write" element={<ContractWritePage />} />
          </Route>

          {/* ✅ 로그인된 사용자는 접근할 수 없는 라우트 (로그인 관련) */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/loginSuccess" element={<LoginSuccess />} />
          </Route>
          {/* ✅ 404 페이지 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
