import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import AppInitializer from "./routes/AppInitializer.tsx";
import MobileLayout from "./components/layouts/MobileLayout";
import HomeBoss from "./pages/home/boss/HomeBoss.tsx";
import Schedule from "./pages/schedule/boss/Schedule.tsx";
import Employees from "./pages/employee/boss/Employees.tsx";
import Task from "./pages/Task";
import Store from "./pages/store/boss/Store.tsx";
import NotFound from "./pages/NotFound";
import LoginSuccess from "./pages/login/LoginSuccess.tsx";
import Login from "./pages/login/Login.tsx";
import Signup from "./pages/signup/Signup.tsx";
import StoreRegisterBossPage from "./pages/store/boss/StoreRegisterBossPage.tsx";
import AddressSearchPopup from "./pages/store/boss/AddressSearchPopup.tsx";
import StoreInfoPage from "./pages/store/boss/StoreInfoPage.tsx";
import AttendanceSettingPage from "./pages/store/boss/AttendanceSettingPage.tsx";
import SalarySettingPage from "./pages/store/boss/SalarySettingPage.tsx";
import NotificationSettingPage from "./pages/store/boss/NotificationSettingPage.tsx";
import StoreInfoEditPage from "./pages/store/boss/StoreInfoEditPage.tsx";
import StoreRegisterIntro from "./pages/store/staff/StoreRegisterIntro.tsx";
import StoreRegisterStaffPage from "./pages/store/staff/StoreRegisterStaffPage.tsx";
import ContractPage from "./pages/contract/Contract.tsx";
import ContractRegisterPage from "./pages/contract/ContractRegisterPage.tsx";
import ContractDetailPage from "./pages/contract/ContractDetailPage.tsx";
import ContractWritePage from "./pages/contract/ContractWritePage.tsx";
import Landing from "./pages/auth/Landing.tsx";
import RoleRoute from "./routes/RoleRoute.tsx";
import HomeStaff from "./pages/home/staff/HomeStaff.tsx";
import ScheduleStaff from "./pages/schedule/staff/ScheduleStaff.tsx";

//Todo: 추후 페이지 별 Lazy Loading 적용 예정
function App() {
  return (
    <Router>
      <AppInitializer />
      <Routes>
        {/* ✅ 로그인된 사용자는 접근할 수 없는 라우트 (로그인 관련) */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/loginSuccess" element={<LoginSuccess />} />
        </Route>
        {/* ✅ 404 페이지 */}
        <Route path="*" element={<NotFound />} />

        {/*모바일 UI*/}
        <Route path="/" element={<MobileLayout />}>
          <Route index element={<Landing />} />

          {/* ✅ 로그인 된 사용자만 접근 가능한 라우트 */}
          <Route element={<ProtectedRoute />}>
            {/*공용페이지*/}
            <Route path="/address-search" element={<AddressSearchPopup />} />
            <Route path="/signup" element={<Signup />} />
            {/* ✅ BOSS 전용 라우팅 */}
            <Route element={<RoleRoute allowedRole="BOSS" />}>
              <Route path="boss" element={<HomeBoss />} />
              <Route path="boss/schedule" element={<Schedule />} />
              <Route path="boss/employees" element={<Employees />} />
              <Route path="boss/task" element={<Task />} />
              <Route path="boss/store" element={<Store />} />
              <Route
                path="boss/store/register"
                element={<StoreRegisterBossPage />}
              />
              <Route path="boss/store/info" element={<StoreInfoPage />} />
              <Route
                path="boss/store/info/edit"
                element={<StoreInfoEditPage />}
              />
              <Route
                path="boss/store/attendance"
                element={<AttendanceSettingPage />}
              />
              <Route path="boss/store/salary" element={<SalarySettingPage />} />
              <Route
                path="boss/store/notification"
                element={<NotificationSettingPage />}
              />
            </Route>

            {/* ✅ STAFF 전용 라우팅 */}
            <Route element={<RoleRoute allowedRole="STAFF" />}>
              <Route path="staff" element={<HomeStaff />} />
              <Route path="staff/schedule" element={<ScheduleStaff />} />
              <Route path="staff/task" element={<NotFound />} />
              <Route path="staff/payroll" element={<NotFound />} />
              <Route path="staff/mypage" element={<NotFound />} />
              <Route
                path="staff/store/intro"
                element={<StoreRegisterIntro />}
              />
              <Route
                path="staff/store/register"
                element={<StoreRegisterStaffPage />}
              />
            </Route>
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
