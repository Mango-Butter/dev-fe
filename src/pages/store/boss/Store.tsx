import { useNavigate } from "react-router-dom";
import BossStoreCard from "./BossStoreCard.tsx";

const Store = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 self-stretch p-5 flex-col items-center justify-start h-full gap-6">
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
          onClick={() => navigate("/boss/store/attendance")}
          className="cursor-pointer flex py-3 px-4 border border-grayscale-300 bg-white shadow-basic rounded-xl flex-col justify-center items-start gap-2 self-stretch"
        >
          <span className="title-2">출퇴근 방식 설정</span>
          <span className="body-3 text-gray-500">
            알바생이 출퇴근하는 방식을 설정해요
          </span>
        </div>

        <div
          onClick={() => navigate("/boss/store/salary")}
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

export default Store;
