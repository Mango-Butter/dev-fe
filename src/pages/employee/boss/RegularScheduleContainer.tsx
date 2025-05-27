import {
  DayOfWeek,
  RegularSchedule,
  dayOfWeekList,
  weekdayKorean,
} from "../../../types/staff";
import { deleteRegularSchedule } from "../../../api/boss/staff";
import Button from "../../../components/common/Button";
import { showConfirm } from "../../../libs/showConfirm.ts";

interface Props {
  storeId: number;
  staffId: number;
  selectedDays: DayOfWeek[];
  availableDays: DayOfWeek[];
  schedules: RegularSchedule[];
  onToggleDay: (day: DayOfWeek) => void;
  onClickAdd: () => void;
  onDeleteSuccess?: () => void;
}

const RegularScheduleContainer = ({
  storeId,
  staffId,
  selectedDays,
  availableDays,
  schedules,
  onToggleDay,
  onClickAdd,
  onDeleteSuccess,
}: Props) => {
  const handleDelete = async (regularGroupId: number) => {
    if (!storeId || !staffId) return;

    const confirmed = await showConfirm({
      title: "정말 삭제할까요?",
      text: "이 고정 스케줄은 복구할 수 없어요.",
      confirmText: "삭제할래요",
      cancelText: "취소할래요",
      icon: "question",
    });

    if (!confirmed) return;

    try {
      await deleteRegularSchedule(storeId, staffId, regularGroupId);
      onDeleteSuccess?.();
    } catch (err) {
      console.error("고정 스케줄 삭제 실패", err);
    }
  };

  const filteredSchedules = schedules
    .filter((s) => selectedDays.includes(s.dayOfWeek))
    .sort(
      (a, b) =>
        dayOfWeekList.indexOf(a.dayOfWeek) - dayOfWeekList.indexOf(b.dayOfWeek),
    );

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <p className="title-1">고정 스케줄</p>
        <button onClick={onClickAdd} className="text-sm text-main underline">
          스케줄 추가하기
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayOfWeekList.map((day) => (
          <button
            key={day}
            type="button"
            disabled={!availableDays.includes(day)}
            onClick={() => onToggleDay(day)}
            className={`rounded-lg border p-2 text-sm 
              ${!availableDays.includes(day) ? "text-gray-300 bg-gray-50 cursor-not-allowed" : ""}
              ${selectedDays.includes(day) ? "border-primary-600 bg-primary-100 text-primary-900" : "text-gray-600"}`}
          >
            {weekdayKorean[day]}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {filteredSchedules.map((schedule) => (
          <div
            key={schedule.regularGroupId}
            className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200"
          >
            <div className="flex gap-4 items-center">
              <span className="w-11 h-11 flex items-center justify-center rounded-md border p-2 body-2 border-primary-600 bg-primary-100 text-primary-900">
                {weekdayKorean[schedule.dayOfWeek]}
              </span>
              <div className="flex flex-col gap-1">
                <p className="text-sm text-gray-600">
                  시간
                  <span className="font-semibold text-black ml-2">
                    {schedule.startTime.slice(0, 5)}~
                    {schedule.endTime.slice(0, 5)}
                  </span>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  기간{" "}
                  <span className="ml-2">
                    {schedule.startDate}~{schedule.endDate}
                  </span>
                </p>
              </div>
            </div>

            <Button
              theme="text"
              className="text-warning body-3 p-0 pr-1"
              size="sm"
              onClick={() => handleDelete(schedule.regularGroupId)}
            >
              삭제
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegularScheduleContainer;
