import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import AppInitializer from "./routes/AppInitializer.tsx";
import MobileLayout from "./components/layouts/MobileLayout";
import NotFound from "./pages/NotFound";
import LoginSuccess from "./pages/login/LoginSuccess.tsx";
import Login from "./pages/login/Login.tsx";
import Signup from "./pages/signup/Signup.tsx";
import AddressSearchPopup from "./pages/store/boss/AddressSearchPopup.tsx";
import RoleRoute from "./routes/RoleRoute.tsx";
import Landing from "./pages/Landing.tsx";
import FullScreenLoading from "./components/common/FullScreenLoading.tsx";
import HomeBoss from "./pages/home/boss/HomeBoss.tsx";
import HomeStaff from "./pages/home/staff/HomeStaff.tsx";

// Lazy-loaded components (boss)
const Schedule = lazy(() => import("./pages/schedule/boss/Schedule.tsx"));
const Employees = lazy(() => import("./pages/employee/boss/Employees.tsx"));
const Task = lazy(() => import("./pages/Task"));
const Store = lazy(() => import("./pages/store/boss/Store.tsx"));
const StoreRegisterBossPage = lazy(
  () => import("./pages/store/boss/StoreRegisterBossPage.tsx"),
);
const StoreInfoPage = lazy(
  () => import("./pages/store/boss/StoreInfoPage.tsx"),
);
const StoreInfoEditPage = lazy(
  () => import("./pages/store/boss/StoreInfoEditPage.tsx"),
);
const AttendanceSettingPage = lazy(
  () => import("./pages/store/boss/AttendanceSettingPage.tsx"),
);
const SalarySettingPage = lazy(
  () => import("./pages/store/boss/SalarySettingPage.tsx"),
);
const NotificationSettingPage = lazy(
  () => import("./pages/store/boss/NotificationSettingPage.tsx"),
);
const ContractViewPage = lazy(
  () => import("./pages/contract/boss/ContractViewPage.tsx"),
);
const ContractRegisterPage = lazy(
  () => import("./pages/contract/boss/ContractRegisterPage.tsx"),
);
const EmployeeDetailPage = lazy(
  () => import("./pages/employee/boss/EmployeeDetailPage.tsx"),
);
const ContractTemplateRegisterPage = lazy(
  () => import("./pages/contract/boss/ContractTemplateRegisterPage.tsx"),
);
const ContractTemplatePage = lazy(
  () => import("./pages/contract/boss/ContractTemplatePage.tsx"),
);
const BossDocumentPage = lazy(
  () => import("./pages/document/boss/BossDocumentPage.tsx"),
);
const ContractTemplateEditPage = lazy(
  () => import("./pages/contract/boss/ContractTemplateEditPage.tsx"),
);
const BossPayrollPage = lazy(
  () => import("./pages/payroll/boss/BossPayrollPage.tsx"),
);
const BossPayrollEditPage = lazy(
  () => import("./pages/payroll/boss/BossPayrollEditPage.tsx"),
);

// Lazy-loaded components (staff)
const ScheduleStaff = lazy(
  () => import("./pages/schedule/staff/ScheduleStaff.tsx"),
);
const StoreRegisterIntro = lazy(
  () => import("./pages/store/staff/StoreRegisterIntro.tsx"),
);
const StoreRegisterStaffPage = lazy(
  () => import("./pages/store/staff/StoreRegisterStaffPage.tsx"),
);
const StaffAttendancePage = lazy(
  () => import("./pages/attendance/staff/StaffAttendancePage.tsx"),
);
const ContractViewStaffPage = lazy(
  () => import("./pages/contract/staff/ContractViewStaffPage.tsx"),
);
const StaffMyPage = lazy(() => import("./pages/mypage/staff/StaffMyPage.tsx"));
const StaffDocumentPage = lazy(
  () => import("./pages/document/staff/StaffDocumentPage.tsx"),
);

function App() {
  return (
    <Router>
      <AppInitializer />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
      <Suspense fallback={<FullScreenLoading />}>
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<MobileLayout />}>
            {/* PUBIC Routes */}
            <Route element={<PublicRoute />}>
              <Route index element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/loginSuccess" element={<LoginSuccess />} />
            </Route>
            {/* PROTECTED Routes */}
            <Route element={<ProtectedRoute />}>
              {/* COMMON Routes */}
              <Route path="/address-search" element={<AddressSearchPopup />} />
              <Route path="/signup" element={<Signup />} />
              {/* BOSS Routes */}
              <Route element={<RoleRoute allowedRole="BOSS" />}>
                <Route path="boss" element={<HomeBoss />} />
                <Route path="boss/schedule" element={<Schedule />} />
                <Route path="boss/employees" element={<Employees />} />
                <Route
                  path="/boss/employee/:staffId"
                  element={<EmployeeDetailPage />}
                />
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
                <Route
                  path="boss/store/salary"
                  element={<SalarySettingPage />}
                />
                <Route
                  path="boss/store/notification"
                  element={<NotificationSettingPage />}
                />
                <Route
                  path="/boss/contract/template"
                  element={<ContractTemplatePage />}
                />
                <Route
                  path="/boss/contract/template/register"
                  element={<ContractTemplateRegisterPage />}
                />
                <Route
                  path="/boss/contract/template/:id"
                  element={<ContractTemplateEditPage />}
                />
                <Route
                  path="/boss/contract/:id"
                  element={<ContractViewPage />}
                />
                <Route
                  path="/boss/contract/register"
                  element={<ContractRegisterPage />}
                />
                <Route path="/boss/document" element={<BossDocumentPage />} />
                <Route path="/boss/payroll" element={<BossPayrollPage />} />
                <Route
                  path="/boss/payroll/edit"
                  element={<BossPayrollEditPage />}
                />
              </Route>

              {/* STAFF Routes */}
              <Route element={<RoleRoute allowedRole="STAFF" />}>
                <Route path="staff" element={<HomeStaff />} />
                <Route path="staff/schedule" element={<ScheduleStaff />} />
                <Route path="staff/task" element={<NotFound />} />
                <Route path="staff/payroll" element={<NotFound />} />
                <Route path="staff/mypage" element={<StaffMyPage />} />
                <Route path="staff/document" element={<StaffDocumentPage />} />
                <Route
                  path="staff/store/intro"
                  element={<StoreRegisterIntro />}
                />
                <Route
                  path="staff/store/register"
                  element={<StoreRegisterStaffPage />}
                />
                <Route
                  path="staff/contract/:id"
                  element={<ContractViewStaffPage />}
                />
                <Route
                  path="staff/attendance"
                  element={<StaffAttendancePage />}
                />
              </Route>
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
