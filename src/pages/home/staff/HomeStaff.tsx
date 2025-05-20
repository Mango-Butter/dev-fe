import StaffStoreCard from "../../store/staff/StaffStoreCard.tsx";
import StaffAttendanceContainer from "./StaffAttendanceContainer.tsx";
import { useUserStore } from "../../../stores/userStore.ts";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import StaffDocumentContainer from "./StaffDocumentContainer.tsx";

const HomeStaff = () => {
  const { user } = useUserStore();
  const today = format(new Date(), "yyyy.MM.dd EEEE", { locale: ko });

  return (
    <div className="flex flex-col h-full py-3 px-5 gap-4">
      <div className="flex flex-col gap-1">
        <p className="title-1">{today}</p>
        <p className="body-3 text-grayscale-500">
          {user?.name}님, 오늘 근무도 힘내세요!
        </p>
      </div>

      <StaffStoreCard />
      <StaffAttendanceContainer />
      <StaffDocumentContainer />
    </div>
  );
};

export default HomeStaff;
