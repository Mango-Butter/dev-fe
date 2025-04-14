import { Outlet } from "react-router-dom";
import Header from "./Header";
import BottomNav from "./BottomNav";

const MobileLayout = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-white">
      <div className="flex flex-col max-w-[600px] h-full flex-1 shadow-layout-box">
        <Header />
        <main className="flex-1 overflow-auto overflow-x-hidden scrollbar-hide">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
};

export default MobileLayout;
