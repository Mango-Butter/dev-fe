import StaffStoreCard from "../../store/staff/StaffStoreCard.tsx";
import { useUserStore } from "../../../stores/userStore.ts";
import StaffDocumentContainer from "./StaffDocumentContainer.tsx";

const StaffMyPage = () => {
  const { user } = useUserStore();
  return (
    <div className="flex flex-1 w-full self-stretch p-5 flex-col items-center justify-start h-full gap-6">
      <div className="flex w-full items-center justify-start gap-3">
        <img
          src={user?.profileImageUrl}
          alt="profile"
          className="w-14 h-14 rounded-full object-cover"
        />
        <div className="flex flex-col justify-center items-start gap-3">
          <p className="heading-2">{user?.name}</p>
          <button className="body-3 text-grayscale-500 underline">
            내 정보 수정
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <div className="w-full justify-start items-center title-1">내 매장</div>
        <StaffStoreCard />
      </div>
      <div className="w-full">
        <StaffDocumentContainer />
      </div>
    </div>
  );
};

export default StaffMyPage;
