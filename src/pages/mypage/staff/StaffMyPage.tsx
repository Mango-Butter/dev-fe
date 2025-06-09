import StaffStoreCard from "../../store/staff/StaffStoreCard.tsx";
import { useUserStore } from "../../../stores/userStore.ts";
import StaffDocumentContainer from "./StaffDocumentContainer.tsx";
import StaffPayrollSettingContainer from "./StaffPayrollSettingContainer.tsx";
import { useAuthStore } from "../../../stores/authStore.ts";
import { useNavigate } from "react-router-dom";

const StaffMyPage = () => {
  const { user } = useUserStore();
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 w-full self-stretch p-5 flex-col items-center justify-start h-full gap-6">
      <div className="flex w-full p-4 border border-grayscale-300 bg-white shadow-blue-shadow rounded-xl items-start gap-3">
        <img
          src={user?.profileImageUrl}
          alt="profile"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col justify-center items-start gap-2 flex-1">
          <p className="title-1">{user?.name}</p>
          <div className="flex flex-col justify-center items-start gap-1">
            <div className="flex w-full gap-2">
              <span className="w-fit body-4 text-grayscale-900">전화번호</span>
              <span className="body-4 text-grayscale-600">{user?.phone}</span>
            </div>
            <div className="flex w-full gap-2">
              <span className="w-fit body-4 text-grayscale-900">이메일</span>
              <span className="body-4 text-grayscale-600">{user?.email}</span>
            </div>
          </div>
        </div>
        <button
          onClick={async () => {
            await useAuthStore.getState().logout();
            navigate("/login");
          }}
          className="text-red-400 underline body-4 ml-auto"
        >
          로그아웃
        </button>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <div className="w-full justify-start items-center title-1">내 매장</div>
        <StaffStoreCard />
      </div>
      <StaffPayrollSettingContainer />
      <StaffDocumentContainer />
    </div>
  );
};

export default StaffMyPage;
