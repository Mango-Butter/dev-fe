import React from "react";
import { TaskRoutine } from "../../../../types/task.ts";
import Label from "../../../../components/common/Label.tsx";
import { isValidStoreId } from "../../../../utils/store.ts";
import { BossTaskAPI } from "../../../../api/boss/task.ts";
import Button from "../../../../components/common/Button.tsx";
import { toast } from "react-toastify";
import { showConfirm } from "../../../../libs/showConfirm.ts";

interface Props {
  routine: TaskRoutine;
  storeId: number | undefined;
  fetchTaskRoutines: () => void;
}

const weekdayMap: Record<string, string> = {
  MONDAY: "월",
  TUESDAY: "화",
  WEDNESDAY: "수",
  THURSDAY: "목",
  FRIDAY: "금",
  SATURDAY: "토",
  SUNDAY: "일",
};

const TaskRoutineCard: React.FC<Props> = ({
  routine,
  storeId,
  fetchTaskRoutines,
}) => {
  const {
    id: taskRoutineId,
    title,
    description,
    repeatType,
    repeatDays,
    repeatDates,
    startDate,
    endDate,
    startTime,
    endTime,
    photoRequired,
    referenceImageUrl,
  } = routine;

  const getRepeatLabel = () => {
    switch (repeatType) {
      case "DAILY":
        return "매일";
      case "WEEKLY":
        return `매주 ${repeatDays.map((d) => weekdayMap[d]).join(", ")}`;
      case "MONTHLY":
        return `매달 ${repeatDates.map((d) => `${d}일`).join(", ")}`;
      default:
        return "-";
    }
  };

  const handleDelete = async (deleteOption: "ALL" | "PENDING") => {
    if (!isValidStoreId(storeId)) return;

    const confirmed = await showConfirm({
      title:
        deleteOption === "ALL"
          ? "모든 반복 업무를 삭제할까요?"
          : "미완료된 반복 업무만 삭제할까요?",
      text:
        deleteOption === "ALL"
          ? "해당 반복 업무에 속한 모든 업무가 삭제됩니다.\n되돌릴 수 없습니다."
          : "이미 수행한 업무는 남기고, 미완료 업무만 삭제됩니다.",
      icon: "warning",
      confirmText: "삭제하기",
      cancelText: "취소",
    });

    if (!confirmed) return;

    try {
      await BossTaskAPI.deleteTaskRoutine(storeId, taskRoutineId, deleteOption);
      toast.success(
        deleteOption === "ALL"
          ? "모든 반복 업무가 삭제되었습니다."
          : "미완료 반복 업무가 삭제되었습니다.",
      );
      fetchTaskRoutines();
    } catch (err) {
      console.error("반복 업무 삭제 실패:", err);
      toast.error("삭제에 실패했습니다.");
    }
  };

  return (
    <div className="flex justify-between bg-white p-3 border-b border-gray-200 mb-2">
      <div className="flex flex-col justify-between gap-2 items-start w-full">
        <div className="flex items-center justify-between w-full">
          <p className="heading-2">{title}</p>
          <Label theme="ghost" size="sm" className="text-grayscale-500">
            {photoRequired ? "인증샷" : "체크"}
          </Label>
        </div>
        <p className="text-sm text-gray-600">{description}</p>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <strong>반복:</strong> {getRepeatLabel()}
          </span>
          <span>
            <strong>시간:</strong> {startTime} - {endTime}
          </span>
        </div>
        <div className="text-sm text-gray-500">
          <strong>기간:</strong> {startDate} ~ {endDate}
        </div>
        {referenceImageUrl && (
          <img
            src={referenceImageUrl}
            alt="참고 이미지"
            className="w-full h-32 object-cover rounded mt-2"
          />
        )}
        <div className="flex w-full gap-2 mt-2">
          <Button
            size="sm"
            theme="ghost2"
            onClick={() => handleDelete("ALL")}
            className="flex-1 text-warning h-10 border-warning"
          >
            전체 삭제
          </Button>
          <Button
            size="sm"
            theme="ghost2"
            onClick={() => handleDelete("PENDING")}
            className="flex-1 h-10 text-orange-500 border-orange-500"
          >
            미완료만 삭제
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskRoutineCard;
