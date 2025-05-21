import { NavLink } from "react-router-dom";
import { useLayoutStore } from "../../stores/layoutStore.ts";
import { useUserStore } from "../../stores/userStore.ts";

// 아이콘들
import { HomeOff, HomeOn } from "../icons/HomeIcon";
import { BusinessOff, BusinessOn } from "../icons/BusinessIcon.tsx";
import { CalendarOff, CalendarOn } from "../icons/CalendarIcon.tsx";
import { PersonOff, PersonOn } from "../icons/PersonIcon.tsx";
import { CoinOff, CoinOn } from "../icons/CoinIcon.tsx";

const BottomNav = () => {
  const { bottomNavVisible } = useLayoutStore();
  const user = useUserStore((state) => state.user);

  const navItems =
    user?.role === "BOSS"
      ? [
          {
            label: "홈",
            to: "/boss",
            icon: <HomeOff />,
            iconActive: <HomeOn />,
          },
          {
            label: "업무",
            to: "/boss/task",
            icon: <BusinessOff />,
            iconActive: <BusinessOn />,
          },
          {
            label: "스케줄",
            to: "/boss/schedule",
            icon: <CalendarOff />,
            iconActive: <CalendarOn />,
          },
          {
            label: "급여",
            to: "/boss/payroll",
            icon: <CoinOff />,
            iconActive: <CoinOn />,
          },
          {
            label: "직원",
            to: "/boss/employees",
            icon: <PersonOff />,
            iconActive: <PersonOn />,
          },
        ]
      : user?.role === "STAFF"
        ? [
            {
              label: "홈",
              to: "/staff",
              icon: <HomeOff />,
              iconActive: <HomeOn />,
            },
            {
              label: "업무",
              to: "/staff/task",
              icon: <BusinessOff />,
              iconActive: <BusinessOn />,
            },
            {
              label: "스케줄",
              to: "/staff/schedule",
              icon: <CalendarOff />,
              iconActive: <CalendarOn />,
            },
            {
              label: "급여",
              to: "/staff/payroll",
              icon: <CoinOff />,
              iconActive: <CoinOn />,
            },
            {
              label: "My",
              to: "/staff/mypage",
              icon: <PersonOff />,
              iconActive: <PersonOn />,
            },
          ]
        : [];

  return (
    <nav
      className={`h-14 ${
        bottomNavVisible ? "flex" : "hidden"
      } justify-around items-center bg-white border-t`}
    >
      {navItems.map(({ to, label, icon, iconActive }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/boss" || to === "/staff"}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center text-xs ${
              isActive ? "text-primary-900 font-semibold" : "text-gray-500"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className="w-6 h-6 mb-1">{isActive ? iconActive : icon}</div>
              {label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
