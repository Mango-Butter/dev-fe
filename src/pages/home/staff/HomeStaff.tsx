import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../../stores/userStore.ts";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import Label from "../../../components/common/Label.tsx";
import Button from "../../../components/common/Button.tsx";
import useStaffStoreStore from "../../../stores/useStaffStoreStore.ts";
import StaffStoreCard from "../../store/staff/StaffStoreCard.tsx"; // ✅ 상태 저장소

const Home = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { selectedStore } = useStaffStoreStore(); // ✅ store 상태
  const today = format(new Date(), "yyyy.MM.dd EEEE", { locale: ko });

  if (!selectedStore) {
    return (
      <div className="flex items-center justify-center h-full px-5">
        <p className="body-2 text-grayscale-600 text-center">
          아직 합류한 매장이 없습니다.
          <br />
          초대코드를 통해 매장에 합류해 주세요.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full py-3 px-5 gap-4">
      {/* ✅ 매장 카드 */}
      <StaffStoreCard />

      {/* 날짜/유저 인사 */}
      <div className="flex flex-col justify-center items-start gap-1 self-stretch">
        <p className="title-1">{today}</p>
        <p className="body-3 text-grayscale-500">
          {user?.name}님, 오늘 근무도 힘내세요!
        </p>
      </div>

      {/* 출근 정보 카드 */}
      <div className="flex p-4 bg-white shadow-basic rounded-lg flex-col justify-center items-start gap-3 self-stretch">
        <div className="w-full flex flex-col gap-1">
          <span className="title-2">{selectedStore.storeName}</span>
          <div className="flex gap-2 items-center">
            <Label className="border border-positive text-positive bg-white">
              출근
            </Label>
            <span className="body-3 text-grayscale-500">10:00</span>
            <span className="body-3 text-grayscale-500">~</span>
            <span className="body-3 text-grayscale-500">10:00</span>
          </div>
        </div>
        <div className="flex w-full gap-2">
          <span className="w-fit body-3 text-grayscale-900">출근 시간</span>
          <span className="body-3 text-grayscale-600">10:07</span>
        </div>
        <div className="flex w-full gap-2">
          <span className="w-fit body-3 text-grayscale-900">
            퇴근시간까지 2시간 20분 20초 남았습니다!
          </span>
        </div>
        <Button
          className="w-full body-3"
          theme="secondary"
          size="sm"
          onClick={() => navigate("/staff/attendance")}
        >
          퇴근하기
        </Button>
      </div>
    </div>
  );
};

export default Home;
