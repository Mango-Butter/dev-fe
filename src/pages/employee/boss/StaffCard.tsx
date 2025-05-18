import { useNavigate } from "react-router-dom";
import { StaffAttendance, weekdayKorean } from "../../../types/staff.ts";

function StaffCard({ staff, attendanceCount, workDays }: StaffAttendance) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/boss/employee/${staff.staffId}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-basic"
    >
      <img
        src={staff.profileImageUrl}
        alt={staff.name}
        className="w-14 h-14 rounded-full object-cover border border-gray-200"
      />
      <div className="flex flex-col justify-center flex-1">
        <p className="title-1 text-black">{staff.name}</p>
        <p className="body-3 text-gray-500 mt-1">
          고정 근무 요일
          <span className="title-3 text-black ml-2">
            {workDays.length > 0
              ? workDays.map((day) => weekdayKorean[day]).join(" · ")
              : "미등록"}
          </span>
        </p>
        <div className="flex w-full gap-2 mt-2">
          <span className="text-green-600 border border-green-600 px-2 py-[2px] title-4 rounded-full">
            출근 {attendanceCount.normalCount}회
          </span>
          <span className="text-yellow-600 border border-yellow-500 px-2 py-[2px] title-4 rounded-full">
            지각 {attendanceCount.lateCount}회
          </span>
          <span className="text-red-500 border border-red-500 px-2 py-[2px] title-4 rounded-full">
            결근 {attendanceCount.absentCount}회
          </span>
        </div>
      </div>
    </div>
  );
}

export default StaffCard;
