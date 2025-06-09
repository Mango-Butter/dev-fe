import { useNavigate } from "react-router-dom";
import BossStoreCard from "../../store/boss/BossStoreCard.tsx";
import { useUserStore } from "../../../stores/userStore.ts";
import { useAuthStore } from "../../../stores/authStore.ts";

const BossStorePage = () => {
  const { user } = useUserStore();

  const navigate = useNavigate();

  return (
    <div className="flex flex-1 self-stretch p-5 flex-col items-center justify-start gap-6">
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
      <BossStoreCard />
      {/* 메뉴 카드들 */}
      <div className="flex flex-col items-start gap-3 self-stretch">
        <div
          onClick={() => navigate("/boss/store/info")}
          className="cursor-pointer flex py-3 px-4 border border-grayscale-300 bg-white shadow-basic rounded-xl flex-col justify-center items-start gap-2 self-stretch"
        >
          <span className="title-2">매장 정보</span>
          <span className="body-3 text-gray-500">
            망고보스에 등록된 매장의 정보를 확인해요
          </span>
        </div>

        <div
          onClick={() => navigate("/boss/subscribe")}
          className="cursor-pointer flex py-3 px-4 border border-grayscale-300 bg-white shadow-basic rounded-xl flex-col justify-center items-start gap-2 self-stretch"
        >
          <span className="title-2">구독 설정</span>
          <span className="body-3 text-gray-500">
            매장의 요금제를 확인하고 설정해요
          </span>
        </div>

        <div
          onClick={() => navigate("/boss/store/attendance")}
          className="cursor-pointer flex py-3 px-4 border border-grayscale-300 bg-white shadow-basic rounded-xl flex-col justify-center items-start gap-2 self-stretch"
        >
          <span className="title-2">출퇴근 방식 설정</span>
          <span className="body-3 text-gray-500">
            알바생이 출퇴근하는 방식을 설정해요
          </span>
        </div>

        <div
          onClick={() => navigate("/boss/store/payroll-setting")}
          className="cursor-pointer flex py-3 px-4 border border-grayscale-300 bg-white shadow-basic rounded-xl flex-col justify-center items-start gap-2 self-stretch"
        >
          <span className="title-2">급여 설정</span>
          <span className="body-3 text-gray-500">
            매장에서 제공하는 급여 정보를 설정해요
          </span>
        </div>

        <div
          onClick={() => navigate("/boss/store/notification")}
          className="cursor-pointer flex py-3 px-4 border border-grayscale-300 bg-white shadow-basic rounded-xl flex-col justify-center items-start gap-2 self-stretch"
        >
          <span className="title-2">알림 설정</span>
          <span className="body-3 text-gray-500">
            매장에서의 알림 범위를 설정해요
          </span>
        </div>
      </div>
    </div>
  );
};

export default BossStorePage;
