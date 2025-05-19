import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import AppInitializer from "./routes/AppInitializer.tsx";
import MobileLayout from "./components/layouts/MobileLayout";
import NotFound from "./pages/NotFound";
import LoginSuccess from "./pages/login/LoginSuccess.tsx";
import Login from "./pages/login/Login.tsx";
import Signup from "./pages/signup/Signup.tsx";
import AddressSearchPopup from "./pages/store/boss/AddressSearchPopup.tsx";
import ContractViewPage from "./pages/contract/boss/ContractViewPage.tsx";
import ContractRegisterPage from "./pages/contract/boss/ContractRegisterPage.tsx";
import RoleRoute from "./routes/RoleRoute.tsx";
import Landing from "./pages/Landing.tsx";
import EmployeeDetailPage from "./pages/employee/boss/EmployeeDetailPage.tsx";
import ContractTemplateRegisterPage from "./pages/contract/boss/ContractTemplateRegisterPage.tsx";
import ContractTemplatePage from "./pages/contract/boss/ContractTemplatePage.tsx";
import ContractViewStaffPage from "./pages/contract/staff/ContractViewStaffPage.tsx";
import StaffMyPage from "./pages/mypage/staff/StaffMyPage.tsx";
import StaffDocumentPage from "./pages/document/staff/StaffDocumentPage.tsx";
import BossDocumentPage from "./pages/document/boss/BossDocumentPage.tsx";

// Lazy-loaded components (boss)
const HomeBoss = lazy(() => import("./pages/home/boss/HomeBoss.tsx"));
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

// Lazy-loaded components (staff)
const HomeStaff = lazy(() => import("./pages/home/staff/HomeStaff.tsx"));
const ScheduleStaff = lazy(
  () => import("./pages/schedule/staff/ScheduleStaff.tsx"),
);
const StoreRegisterIntro = lazy(
  () => import("./pages/store/staff/StoreRegisterIntro.tsx"),
);
const StoreRegisterStaffPage = lazy(
  () => import("./pages/store/staff/StoreRegisterStaffPage.tsx"),
);

// Suspense Wrapper
const withSuspense = (Component: React.LazyExoticComponent<any>) => (
  <Suspense fallback={<div>로딩 중...</div>}>
    <Component />
  </Suspense>
);

function App() {
  return (
    <Router>
      <AppInitializer />
      <Routes>
        <Route path="*" element={<NotFound />} />
        <Route index element={<Landing />} />
        <Route path="/" element={<MobileLayout />}>
          {/* PUBIC Routes */}
          <Route element={<PublicRoute />}>
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
              <Route path="boss" element={withSuspense(HomeBoss)} />
              <Route path="boss/schedule" element={withSuspense(Schedule)} />
              <Route path="boss/employees" element={withSuspense(Employees)} />
              <Route
                path="/boss/employee/:staffId"
                element={<EmployeeDetailPage />}
              />
              <Route path="boss/task" element={withSuspense(Task)} />
              <Route path="boss/store" element={withSuspense(Store)} />
              <Route
                path="boss/store/register"
                element={withSuspense(StoreRegisterBossPage)}
              />
              <Route
                path="boss/store/info"
                element={withSuspense(StoreInfoPage)}
              />
              <Route
                path="boss/store/info/edit"
                element={withSuspense(StoreInfoEditPage)}
              />
              <Route
                path="boss/store/attendance"
                element={withSuspense(AttendanceSettingPage)}
              />
              <Route
                path="boss/store/salary"
                element={withSuspense(SalarySettingPage)}
              />
              <Route
                path="boss/store/notification"
                element={withSuspense(NotificationSettingPage)}
              />
              <Route
                path="/boss/contract/template"
                element={<ContractTemplatePage />}
              />
              <Route
                path="/boss/contract/template/register"
                element={<ContractTemplateRegisterPage />}
              />
              <Route path="/boss/contract/:id" element={<ContractViewPage />} />
              <Route
                path="/boss/contract/register"
                element={<ContractRegisterPage />}
              />
              <Route path="/boss/document" element={<BossDocumentPage />} />
            </Route>

            {/* STAFF Routes */}
            <Route element={<RoleRoute allowedRole="STAFF" />}>
              <Route path="staff" element={withSuspense(HomeStaff)} />
              <Route
                path="staff/schedule"
                element={withSuspense(ScheduleStaff)}
              />
              <Route path="staff/task" element={<NotFound />} />
              <Route path="staff/payroll" element={<NotFound />} />
              <Route path="staff/mypage" element={<StaffMyPage />} />
              <Route path="staff/document" element={<StaffDocumentPage />} />
              <Route
                path="staff/store/intro"
                element={withSuspense(StoreRegisterIntro)}
              />
              <Route
                path="staff/store/register"
                element={withSuspense(StoreRegisterStaffPage)}
              />
              <Route
                path="/staff/contract/:id"
                element={<ContractViewStaffPage />}
              />
            </Route>
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
