import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header.tsx";
import BottomNav from "./BottomNav.tsx";

const MobileLayout = () => {
  const location = useLocation();
  const path = location.pathname;

  // Header와 BottomNav를 제외할 경로 목록 (예: 로그인페이지)
  const noLayoutPaths = ["/login"];

  const isLayoutHidden = noLayoutPaths.some((route) => path.startsWith(route));

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-white">
      <div className="flex flex-col max-w-[600px] h-full flex-1 shadow-layout-box">
        {!isLayoutHidden && <Header />}
        <main className="flex-1 overflow-auto overflow-x-hidden scrollbar-hide">
          <Outlet />
        </main>
        {!isLayoutHidden && <BottomNav />}
      </div>
    </div>
  );
};

export default MobileLayout;
