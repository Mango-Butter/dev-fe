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
import FullScreenLoading from "./components/common/FullScreenLoading.tsx";
import HomeBoss from "./pages/home/boss/HomeBoss.tsx";
import HomeStaff from "./pages/home/staff/HomeStaff.tsx";
import HomeAdmin from "./pages/home/admin/HomeAdmin.tsx";
import UnifiedPWAPrompt from "./libs/fcm/UnifiedPWAPrompt.tsx";
import PdfViewerPage from "./pages/PdfViewerPage.tsx";
import SubscribePage from "./pages/mypage/boss/SubscribePage.tsx";
import SuccessPage from "./pages/mypage/boss/SuccessPage.tsx";
import FailPage from "./pages/mypage/boss/FailPage.tsx";

// Lazy-loaded components (boss)
const Landing = lazy(() => import("./pages/landing/Landing.tsx"));
const Schedule = lazy(() => import("./pages/schedule/boss/Schedule.tsx"));
const Employees = lazy(() => import("./pages/employee/boss/Employees.tsx"));
const Task = lazy(() => import("./pages/task/boss/TaskPage.tsx"));
const Store = lazy(() => import("./pages/mypage/boss/BossStorePage.tsx"));
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
  () => import("./pages/mypage/boss/AttendanceSettingPage.tsx"),
);
const PayrollSettingPage = lazy(
  () => import("./pages/mypage/boss/PayrollSettingPage.tsx"),
);
const NotificationSettingPage = lazy(
  () => import("./pages/mypage/boss/NotificationSettingPage.tsx"),
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
const BossAutoTransferEditPage = lazy(
  () =>
    import("./pages/payroll/boss/autoTransfer/BossAutoTransferEditPage.tsx"),
);
const BossPayslipPage = lazy(
  () => import("./pages/payroll/boss/history/BossPayslipPage.tsx"),
);
const AccountRegisterPage = lazy(
  () => import("./pages/mypage/boss/AccountRegisterPage.tsx"),
);
const BossAlarmPage = lazy(
  () => import("./pages/alarm/boss/BossAlarmPage.tsx"),
);
const TaskBossDetailPage = lazy(
  () => import("./pages/task/boss/checklist/TaskDetailPage.tsx"),
);
const TaskRoutinePage = lazy(
  () => import("./pages/task/boss/checklist/TaskRoutinePage.tsx"),
);
const BossReportDetailPage = lazy(
  () => import("./pages/task/boss/report/BossReportDetailPage.tsx"),
);

// Lazy-loaded components (staff)
const ScheduleStaff = lazy(
  () => import("./pages/schedule/staff/ScheduleStaff.tsx"),
);
const TaskStaff = lazy(() => import("./pages/task/staff/StaffTaskPage.tsx"));
const StaffChecklistDetailPage = lazy(
  () => import("./pages/task/staff/checklist/StaffChecklistDetailPage.tsx"),
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
const StaffPayslipPage = lazy(
  () => import("./pages/payroll/staff/StaffPayslipPage.tsx"),
);
const StaffPayrollPage = lazy(
  () => import("./pages/payroll/staff/StaffPayrollPage.tsx"),
);
const StaffAccountRegisterPage = lazy(
  () => import("./pages/mypage/staff/StaffAccountRegisterPage.tsx"),
);
const StaffAlarmPage = lazy(
  () => import("./pages/alarm/staff/StaffAlarmPage.tsx"),
);
const StaffReportDetailPage = lazy(
  () => import("./pages/task/staff/report/StaffReportDetailPage.tsx"),
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
      <UnifiedPWAPrompt />
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
              <Route path="/pdf-viewer" element={<PdfViewerPage />} />
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
                <Route
                  path="boss/task/:taskId"
                  element={<TaskBossDetailPage />}
                />
                <Route path="boss/task/routine" element={<TaskRoutinePage />} />
                <Route
                  path="boss/report/:workReportId"
                  element={<BossReportDetailPage />}
                />
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
                  path="boss/store/payroll-setting"
                  element={<PayrollSettingPage />}
                />
                <Route
                  path="boss/store/account-register"
                  element={<AccountRegisterPage />}
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
                  path="/boss/payroll/payslip"
                  element={<BossPayslipPage />}
                />
                <Route
                  path="/boss/payroll/edit"
                  element={<BossAutoTransferEditPage />}
                />
                <Route path="/boss/alarm" element={<BossAlarmPage />} />
                <Route path="/boss/subscribe" element={<SubscribePage />} />
                <Route
                  path="/boss/subscribe/success"
                  element={<SuccessPage />}
                />
                <Route path="/boss/subscribe/fail" element={<FailPage />} />
              </Route>

              {/* STAFF Routes */}
              <Route element={<RoleRoute allowedRole="STAFF" />}>
                <Route path="staff" element={<HomeStaff />} />
                <Route path="staff/schedule" element={<ScheduleStaff />} />
                <Route path="staff/task" element={<TaskStaff />} />
                <Route
                  path="staff/task/:taskId"
                  element={<StaffChecklistDetailPage />}
                />
                <Route
                  path="staff/report/:workReportId"
                  element={<StaffReportDetailPage />}
                />
                <Route path="staff/payroll" element={<StaffPayrollPage />} />
                <Route
                  path="/staff/payroll/payslip"
                  element={<StaffPayslipPage />}
                />
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
                  path="staff/store/account-register"
                  element={<StaffAccountRegisterPage />}
                />
                <Route
                  path="staff/contract/:id"
                  element={<ContractViewStaffPage />}
                />
                <Route
                  path="staff/attendance"
                  element={<StaffAttendancePage />}
                />
                <Route path="/staff/alarm" element={<StaffAlarmPage />} />
              </Route>

              {/* ADMIN Routes */}
              <Route element={<RoleRoute allowedRole="ADMIN" />}>
                <Route path="admin" element={<HomeAdmin />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
