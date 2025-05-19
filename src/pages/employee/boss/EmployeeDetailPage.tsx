import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useBottomSheetStore from "../../../stores/useBottomSheetStore";
import useStoreStore from "../../../stores/storeStore";
import useSelectedStaffStore from "../../../stores/selectedStaffStore";
import RegularScheduleAddForm from "./RegularScheduleAddForm";
import { DayOfWeek, RegularSchedule, StaffBrief } from "../../../types/staff";
import { getRegularSchedules, getStaffDetail } from "../../../api/boss/staff";
import MailIcon from "../../../components/icons/MailIcon";
import { BusinessOff } from "../../../components/icons/BusinessIcon";
import RegularScheduleContainer from "./RegularScheduleContainer";
import AttendanceRecordContainer from "./AttendanceRecordContainer.tsx";

const EmployeeDetailPage = () => {
  const { staffId } = useParams();
  const navigate = useNavigate();
  const { selectedStore } = useStoreStore();
  const { setBottomSheetContent } = useBottomSheetStore();
  const { setSelectedStaffId } = useSelectedStaffStore();
  const [staff, setStaff] = useState<StaffBrief | null>(null);
  const [regularSchedules, setRegularSchedules] = useState<RegularSchedule[]>(
    [],
  );
  const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>([]);
  const [availableDays, setAvailableDays] = useState<DayOfWeek[]>([]);

  const toggleDay = (day: DayOfWeek) => {
    if (!availableDays.includes(day)) return;
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const fetchStaffAndSchedules = async () => {
    if (!selectedStore || !staffId) return;

    try {
      const [staffData, scheduleData] = await Promise.all([
        getStaffDetail(selectedStore.storeId, Number(staffId)),
        getRegularSchedules(selectedStore.storeId, Number(staffId)),
      ]);

      setStaff(staffData);
      setRegularSchedules(scheduleData);

      const days = Array.from(new Set(scheduleData.map((s) => s.dayOfWeek)));
      setAvailableDays(days);
      setSelectedDays(days);
    } catch (err) {
      console.error("알바생 정보 또는 스케줄 조회 실패", err);
      alert("알바생 정보를 불러오는 데 실패했습니다.");
    }
  };

  const openAddRegularScheduleSheet = () => {
    if (!staffId || !staff) return;
    setSelectedStaffId(staffId);
    setBottomSheetContent(
      <RegularScheduleAddForm onSuccess={fetchStaffAndSchedules} />,
      {
        title: `${staff.name} 고정 스케줄 추가`,
        closeOnClickOutside: true,
      },
    );
  };

  const handleContractClick = () => {
    if (!staffId) return;
    setSelectedStaffId(staffId);
    navigate("/boss/contract/register");
  };

  useEffect(() => {
    fetchStaffAndSchedules();
  }, [selectedStore, staffId]);

  return (
    <div className="p-5 flex flex-col gap-6">
      {/* 프로필 */}
      {staff ? (
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
      ) : (
        <div className="text-sm text-gray-500">
          알바생 정보를 불러오는 중...
        </div>
      )}

      {/* 고정 스케줄 */}
      <RegularScheduleContainer
        selectedDays={selectedDays}
        availableDays={availableDays}
        schedules={regularSchedules}
        onToggleDay={toggleDay}
        onClickAdd={openAddRegularScheduleSheet}
        onDeleteSuccess={fetchStaffAndSchedules}
      />

      {/* 서류 관리 */}
      <div>
        <p className="title-1 mb-3">근무 서류 관리</p>
        <div className="grid grid-cols-2 gap-3">
          <div
            className="bg-white border rounded-xl p-3 flex flex-col items-center text-sm"
            onClick={handleContractClick}
          >
            <BusinessOff />
            <p>근로계약서</p>
            <span className="body-3 text-positive mt-1">작성완료</span>
          </div>
          <div className="bg-white border rounded-xl p-3 flex flex-col items-center text-sm">
            <MailIcon />
            <p>기타 문서</p>
            <span className="body-3 text-warning mt-1">미제출 4</span>
          </div>
        </div>
      </div>

      {staff && <AttendanceRecordContainer staffId={staff.staffId} />}
    </div>
  );
};

export default EmployeeDetailPage;
