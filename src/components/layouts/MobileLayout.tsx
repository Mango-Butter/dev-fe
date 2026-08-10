// src/layouts/MobileLayout.tsx
import { Outlet } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";
import Header from "./Header";
import BottomNav from "./BottomNav";
import Modal from "../common/Modal.tsx";
import { useLayoutStore } from "../../stores/layoutStore.ts";
import { useUserStore } from "../../stores/userStore.ts";
import useBottomSheetStore from "../../stores/useBottomSheetStore.ts";
import AdminSidebar from "./AdminSidebar"; // ✅ 추가

// BottomSheet은 framer-motion(gzip ~39KB)에 의존하지만 사용자가 실제로 열 때만
// 필요하다. MobileLayout은 모든 라우트(랜딩 포함)를 감싸므로 eager import하면
// framer-motion이 초기 번들에 실린다. → lazy 로드하되, AnimatePresence의 닫힘
// 애니메이션을 보존하기 위해 "최초 1회 열린 뒤에는 계속 마운트"하는 방식으로 렌더.
const BottomSheet = lazy(() => import("./BottomSheet.tsx"));

const MobileLayout = () => {
  const { bottomNavVisible } = useLayoutStore();
  const user = useUserStore((state) => state.user);
  const isBottomSheetOpen = useBottomSheetStore((s) => s.isBottomSheetOpen);
  const [bottomSheetMounted, setBottomSheetMounted] = useState(false);
  useEffect(() => {
    if (isBottomSheetOpen) setBottomSheetMounted(true);
  }, [isBottomSheetOpen]);

  const bottomSheet = bottomSheetMounted ? (
    <Suspense fallback={null}>
      <BottomSheet />
    </Suspense>
  ) : null;

  // ✅ ADMIN일 경우 다른 레이아웃 렌더링
  if (user?.role === "ADMIN") {
    return (
      <div className="w-full h-screen flex bg-primary-500 p-8">
        <AdminSidebar />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
        <Modal />
        {bottomSheet}
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
        {bottomSheet}
        <BottomNav />
      </div>
    </div>
  );
};

export default MobileLayout;
