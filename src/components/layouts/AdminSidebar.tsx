// src/layouts/AdminSidebar.tsx
import { useNavigate } from "react-router-dom";
import LogoIcon from "../icons/LogoIcon.tsx";

const AdminSidebar = () => {
  const navigate = useNavigate();

  return (
    <nav className="w-64 h-full ">
      <LogoIcon theme="icon" className="h-6 w-6" />

      <ul className="space-y-4">
        <li className="py-4 px-6 flex rounded-xl bg-white gap-4">
          <button
            onClick={() => navigate("/admin")}
            className="heading-2 text-left text-grayscale-900"
          >
            사장 통계
          </button>
        </li>
        <li className="py-4 px-6 flex rounded-xl bg-white gap-4">
          <button
            onClick={() => navigate("/admin/FAQ")}
            className="heading-2 text-left text-grayscale-900"
          >
            FAQ
          </button>
        </li>

        {/* 더 많은 항목 추가 가능 */}
      </ul>
    </nav>
  );
};

export default AdminSidebar;
