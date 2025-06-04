import StaffStoreCard from "../../store/staff/StaffStoreCard.tsx";
import StaffAttendanceContainer from "./StaffAttendanceContainer.tsx";
import { useUserStore } from "../../../stores/userStore.ts";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import StaffDocumentRequestContainer from "./StaffDocumentRequestContainer.tsx";
import { getKSTDate } from "../../../libs/date.ts";
import useStaffStoreStore from "../../../stores/useStaffStoreStore.ts";

const HomeStaff = () => {
  const { user } = useUserStore();
  const { selectedStore } = useStaffStoreStore();
  const storeId = selectedStore?.storeId;
  const todayDate = getKSTDate();
  const today = format(todayDate, "yyyy.MM.dd EEEE", { locale: ko });

  return (
    <div className="flex flex-col h-full py-3 px-5 gap-4">
      <div className="flex flex-col gap-1">
        <p className="title-1">{today}</p>
        <p className="body-3 text-grayscale-500">
          {user?.name}님, 오늘 근무도 힘내세요!
        </p>
      </div>

      <StaffStoreCard />
      {storeId && Number.isInteger(storeId) && storeId! > 0 && (
        <>
          <StaffAttendanceContainer />
          <StaffDocumentRequestContainer />
        </>
      )}
    </div>
  );
};

export default HomeStaff;
