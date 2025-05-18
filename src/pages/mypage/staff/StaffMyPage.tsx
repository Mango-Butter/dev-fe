import { useNavigate } from "react-router-dom";
import StaffStoreCard from "../../store/staff/StaffStoreCard.tsx";
import { useUserStore } from "../../../stores/userStore.ts";

const StaffMyPage = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  return (
    <div className="flex flex-1 self-stretch p-5 flex-col items-center justify-start h-full gap-6">
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

      <div className="flex flex-col gap-2 w-full">
        <div className="w-full justify-start items-center title-1">문서함</div>
        <div className="flex gap-2 w-full">
          <div
            onClick={() => navigate("/staff/document?type=payroll")}
            className="cursor-pointer flex flex-1 py-3 px-4 border border-grayscale-300 bg-white shadow-basic rounded-xl flex-col justify-center items-start gap-2 self-stretch"
          >
            <span className="title-2">급여명세서</span>
            <span className="body-3 text-gray-500">확인 요청 {"0"}</span>
          </div>
          <div
            onClick={() => navigate("/staff/document?type=contract")}
            className="cursor-pointer flex flex-1 py-3 px-4 border border-grayscale-300 bg-white shadow-basic rounded-xl flex-col justify-center items-start gap-2 self-stretch"
          >
            <span className="title-2">근로계약서</span>
            <span className="body-3 text-gray-500">서명 요청 {"1"}</span>
          </div>
          <div
            onClick={() => navigate("staff/document?type=etc")}
            className="cursor-pointer flex flex-1 py-3 px-4 border border-grayscale-300 bg-white shadow-basic rounded-xl flex-col justify-center items-start gap-2 self-stretch"
          >
            <span className="title-2">기타 문서</span>
            <span className="body-3 text-gray-500">제출 요청 {"0"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffMyPage;
