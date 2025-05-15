import { useParams } from "react-router-dom";
import useBottomSheetStore from "../../../stores/useBottomSheetStore.ts";
import RegularScheduleAddForm from "./RegularScheduleAddForm.tsx";
import { StaffBrief } from "../../../types/staff.ts";
import MailIcon from "../../../components/icons/MailIcon.tsx";
import { BusinessOff } from "../../../components/icons/BusinessIcon.tsx";

const EmployeeDetailPage = () => {
  const { staffId } = useParams();
  const id = Number(staffId);
  const { setBottomSheetContent } = useBottomSheetStore();

  const openAddRegularScheduleSheet = (staff: StaffBrief) => {
    setBottomSheetContent(<RegularScheduleAddForm />, {
      title: `${staff.name} 고정 스케줄 추가`,
      closeOnClickOutside: true,
    });
  };

  const handleContractClick = () => {};

  const staff: StaffBrief = {
    staffId: id,
    name: "망알바",
    profileImageUrl:
      "https://mblogthumb-phinf.pstatic.net/MjAyMDAyMTBfODAg/MDAxNTgxMzA0MTE3ODMy.ACRLtB9v5NH-I2qjWrwiXLb7TeUiG442cJmcdzVum7cg.eTLpNg_n0rAS5sWOsofRrvBy0qZk_QcWSfUiIagTfd8g.JPEG.lattepain/1581304118739.jpg?type=w800",
  };

  return (
    <div className="p-5 flex flex-col gap-6">
      {/* 프로필 */}
      <div className="flex items-center gap-4">
        <img
          src={staff.profileImageUrl}
          alt={staff.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <p className="text-lg font-semibold">{staff.name}</p>
          <button className="text-sm text-gray-400 mt-1 underline">
            근로자 삭제
          </button>
        </div>
      </div>

      {/* 고정 스케줄 */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <p className="font-semibold text-base">고정 스케줄</p>
          <button
            onClick={() => openAddRegularScheduleSheet(staff)}
            className="text-sm text-main underline"
          >
            스케줄 추가하기
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <p className="text-sm text-gray-600">
              시간
              <span className="font-semibold text-black ml-2">10:00~16:00</span>
            </p>
            <p className="text-sm text-gray-600 mt-1">
              기간 <span className="ml-2">2025.04.17~2025.05.10</span>
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <p className="text-sm text-gray-600">
              시간
              <span className="font-semibold text-black ml-2">10:00~16:00</span>
            </p>
            <p className="text-sm text-gray-600 mt-1">
              기간 <span className="ml-2">2025.04.17~2025.05.10</span>
            </p>
          </div>
        </div>
      </div>

      {/* 급여 */}
      <div className="bg-white p-4 pb-8 rounded-xl border border-gray-200">
        <p className="text-sm text-gray-600">
          근무일수 <span className="ml-1 font-semibold text-black">20일</span>
        </p>
        <p className="text-sm text-gray-600 mt-1">
          급여
          <span className="ml-1 text-black font-semibold">2,123,456원</span>
        </p>
        <div className="h-2 bg-gradient-02 rounded mt-3 relative">
          <div className="absolute -bottom-5 flex justify-between w-full text-[10px] px-1 text-gray-500">
            <span>소득세</span>
            <span>세금</span>
            <span>보건료</span>
          </div>
        </div>
      </div>

      {/* 근무 서류 관리 */}
      <div>
        <p className="font-semibold mb-3">근무 서류 관리</p>
        <div className="grid grid-cols-3 gap-3">
          <div
            className="bg-white border rounded-xl p-3 flex flex-col items-center text-sm"
            onClick={handleContractClick}
          >
            <BusinessOff />
            <p>근로계약서</p>
            <span className="text-main mt-1">미제출</span>
          </div>
          <div className="bg-white border rounded-xl p-3 flex flex-col items-center text-sm">
            <MailIcon />
            <p>보건증</p>
            <span className="text-red-500 mt-1">곧 만료</span>
          </div>
          <div className="bg-white border rounded-xl p-3 flex flex-col items-center text-sm">
            <MailIcon />
            <p>기타 문서</p>
            <span className="text-main mt-1">제출완료</span>
          </div>
        </div>
      </div>

      {/* 근무 기록 리스트 */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-medium">2024년 3월</p>
        </div>
        <div className="rounded-xl overflow-hidden border border-gray-200">
          <div className="grid grid-cols-3 bg-gray-100 text-sm font-semibold px-4 py-3 text-gray-500">
            <span>날짜</span>
            <span>시간</span>
            <span className="text-center">상태</span>
          </div>
          {[1, 2, 3].map((_, idx) => (
            <div
              key={idx}
              className="grid grid-cols-3 px-4 py-3 border-t border-gray-100 items-center text-sm"
            >
              <span>03.23 일</span>
              <span>08:00~12:00</span>
              <span className="text-center text-green-600">출근</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailPage;
