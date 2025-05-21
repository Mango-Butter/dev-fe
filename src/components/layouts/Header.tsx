import React from "react";
import { useNavigate } from "react-router-dom";
import AccountIcon from "../icons/AccountIcon.tsx";
import AlarmIcon from "../icons/AlarmIcon.tsx";
import ArrowIcon from "../icons/ArrowIcon.tsx";
import LogoIcon from "../icons/LogoIcon.tsx";
import { useLayoutStore } from "../../stores/layoutStore.ts";
import { useUserStore } from "../../stores/userStore.ts";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { headerVisible, title, theme, rightIcon, onBack } = useLayoutStore();
  const user = useUserStore((state) => state.user);

  const handleBack = onBack ?? (() => navigate(-1));

  const handleHome = () => {
    if (user?.role === "BOSS") {
      navigate("/boss");
    } else if (user?.role === "STAFF") {
      navigate("/staff");
    } else {
      navigate("/");
    }
  };

  const handleMypage = () => {
    if (user?.role === "BOSS") {
      navigate("/boss/store");
    } else if (user?.role === "STAFF") {
      navigate("/staff/mypage");
    } else {
      navigate("/");
    }
  };

  return (
    <header
      className={`w-full px-5 py-4 bg-white ${
        headerVisible ? "flex" : "hidden"
      } items-center justify-between`}
    >
      {/* Left */}
      <div className="flex items-center">
        {theme === "default" ? (
          <button onClick={handleHome} aria-label="홈">
            <LogoIcon theme="text" />
          </button>
        ) : (
          <button onClick={handleBack} aria-label="뒤로가기">
            <ArrowIcon direction="left" />
          </button>
        )}
      </div>

      {/* Center */}
      {theme === "plain" && title && (
        <h1 className="text-black heading-2">{title}</h1>
      )}

      {/* Right */}
      <div className="flex items-center gap-3">
        {theme === "default" ? (
          <>
            <button aria-label="알림">
              <AlarmIcon className="w-6 h-6" />
            </button>
            <button aria-label="마이페이지" onClick={handleMypage}>
              <AccountIcon className="w-6 h-6" />
            </button>
          </>
        ) : (
          (rightIcon ?? <div className="w-6 h-6" />)
        )}
      </div>
    </header>
  );
};

export default Header;
