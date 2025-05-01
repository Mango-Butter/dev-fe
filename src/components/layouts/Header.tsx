import React from "react";
import { useNavigate } from "react-router-dom";
import AccountIcon from "../icons/AccountIcon.tsx";
import AlarmIcon from "../icons/AlarmIcon.tsx";
import ArrowIcon from "../icons/ArrowIcon.tsx";
import LogoIcon from "../icons/LogoIcon.tsx";
import { useLayoutStore } from "../../stores/layoutStore.ts";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { headerVisible, title, theme, rightIcon, onBack } = useLayoutStore();

  const handleBack = onBack ?? (() => navigate(-1));

  return (
    <header
      className={`w-full px-5 py-4 bg-white ${
        headerVisible ? "flex" : "hidden"
      } items-center justify-between`}
    >
      {/* Left */}
      <div className="flex items-center">
        {theme === "default" ? (
          <button onClick={() => navigate("/")} aria-label="홈">
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
        <h1 className="text-black text-lg font-bold">{title}</h1>
      )}

      {/* Right */}
      <div className="flex items-center gap-3">
        {theme === "default" ? (
          <>
            <button aria-label="알림">
              <AlarmIcon className="w-6 h-6" />
            </button>
            <button aria-label="마이페이지">
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
