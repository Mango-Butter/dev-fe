// src/layouts/MobileLayout.tsx
import { Outlet } from "react-router-dom";
import Header from "./Header";
import BottomNav from "./BottomNav";
import BottomSheet from "./BottomSheet.tsx";
import Modal from "../common/Modal.tsx";
import { useLayoutStore } from "../../stores/layoutStore.ts";
import { useUserStore } from "../../stores/userStore.ts";
import AdminSidebar from "./AdminSidebar"; // ✅ 추가

const MobileLayout = () => {
  const { bottomNavVisible } = useLayoutStore();
  const user = useUserStore((state) => state.user);

  // ✅ ADMIN일 경우 다른 레이아웃 렌더링
  if (user?.role === "ADMIN") {
    return (
      <div className="w-full h-screen flex bg-primary-500 p-8">
        <AdminSidebar />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
        <Modal />
        <BottomSheet />
      </div>
    );
  }

  // ✅ 일반 유저 레이아웃 (BOSS, STAFF)
  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-white">
      <div className="flex flex-col max-w-[600px] h-full flex-1 shadow-layout-box">
        <Header />
        <main
          className={`flex-1 overflow-auto overflow-x-hidden scrollbar-hide ${
            bottomNavVisible && "mb-20"
          }`}
        >
          <Outlet />
        </main>
        <Modal />
        <BottomSheet />
        <BottomNav />
      </div>
    </div>
  );
};

export default MobileLayout;
