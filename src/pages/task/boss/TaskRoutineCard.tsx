import React from "react";
import { TaskRoutine } from "../../../types/task.ts";
import Label from "../../../components/common/Label.tsx";

interface Props {
  routine: TaskRoutine;
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

const TaskRoutineCard: React.FC<Props> = ({ routine }) => {
  const {
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
        return repeatDays.map((d) => weekdayMap[d]).join(", ");
      case "MONTHLY":
        return repeatDates.map((d) => `${d}일`).join(", ");
      default:
        return "-";
    }
  };

  return (
    <div className="flex justify-between bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-2">
      <div className="flex flex-col justify-between gap-2 items-start w-full">
        <div className="flex items-center justify-between w-full">
          <p className="heading-2">{title}</p>
          <Label theme="ghost" size="lg" className="text-grayscale-500">
            {photoRequired ? "인증샷" : "체크"}
          </Label>
        </div>
        <p className="text-sm text-gray-600">{description}</p>
        <div className="text-sm text-gray-600">
          <span className="mr-2">
            <strong>반복:</strong> {repeatType} ({getRepeatLabel()})
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
      </div>
    </div>
  );
};

export default TaskRoutineCard;
