import { NavLink } from "react-router-dom";

const BottomNav = () => {
  return (
    <nav className="h-14 flex justify-around items-center bg-white border-t">
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive ? "text-blue-500 font-bold" : "text-gray-500"
        }
      >
        홈
      </NavLink>
      <NavLink
        to="/task"
        className={({ isActive }) =>
          isActive ? "text-blue-500 font-bold" : "text-gray-500"
        }
      >
        업무
      </NavLink>
      <NavLink
        to="/schedule"
        className={({ isActive }) =>
          isActive ? "text-blue-500 font-bold" : "text-gray-500"
        }
      >
        스케줄
      </NavLink>
      <NavLink
        to="/employees"
        className={({ isActive }) =>
          isActive ? "text-blue-500 font-bold" : "text-gray-500"
        }
      >
        직원
      </NavLink>
      <NavLink
        to="/store"
        className={({ isActive }) =>
          isActive ? "text-blue-500 font-bold" : "text-gray-500"
        }
      >
        매장
      </NavLink>
    </nav>
  );
};

export default BottomNav;
