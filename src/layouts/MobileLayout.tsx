import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";

const MobileLayout = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-white">
      <div className="flex flex-col max-w-[600px] h-full flex-1 shadow-layout-box">
        <Header /> {/* 상단 네비게이션 */}
        <main className="flex-1 overflow-auto overflow-x-hidden scrollbar-hide">
          <Outlet /> {/* 각 페이지의 내용이 여기에 표시됨 */}
        </main>
        <BottomNav /> {/* 하단 네비게이션 */}
      </div>
    </div>
  );
};

export default MobileLayout;
