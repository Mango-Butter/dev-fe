import React from "react";
import { TaskStatus } from "../../../../types/task.ts";
import { formatTaskTime } from "../../../../utils/task.ts";
import Label from "../../../../components/common/Label.tsx";
import { useNavigate } from "react-router-dom";

export const StaffChecklistCard: React.FC<TaskStatus> = ({
  taskId,
  title,
  isPhotoRequired,
  startTime,
  endTime,
  taskLog,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/staff/task/${taskId}`);
  };

  return (
    <div
      className="w-full flex justify-between bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-2 cursor-pointer hover:bg-gray-50"
      onClick={handleClick}
    >
      <div className="w-full flex flex-col items-start">
        <div className="flex items-center gap-2 mb-2">
          {isPhotoRequired ? (
            <Label theme="lightsecond" size="sm">
              인증샷
            </Label>
          ) : (
            <Label theme="lightsolid" size="sm">
              체크
            </Label>
          )}
        </div>
        <p className="title-1 line-clamp-1 ml-1">{title}</p>

        <div className="w-full flex items-center gap-4 px-1">
          <span className="body-2 text-gray-600">
            {formatTaskTime(startTime)} - {formatTaskTime(endTime)}
          </span>
          {taskLog?.checkedStaff && (
            <div className="flex items-center gap-2">
              <img
                src={taskLog.checkedStaff.profileImageUrl}
                alt={taskLog.checkedStaff.name}
                className="w-4 h-4 rounded-full"
              />
              <span className="body-3 text-gray-600">
                {taskLog.checkedStaff.name}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center">
        {taskLog ? (
          taskLog.taskLogImageUrl ? (
            <img
              src={taskLog.taskLogImageUrl}
              alt="첨부 이미지"
              className="w-12 h-12 rounded-lg object-cover"
            />
          ) : (
            <span className="p-2 w-12 h-12 rounded-lg body-3 text-center justify-center items-center inline-flex bg-green-50 text-positive">
              완료
            </span>
          )
        ) : (
          <span className="p-2 w-12 h-12 rounded-lg body-3 text-center justify-center items-center inline-flex bg-red-50 text-warning">
            미완료
          </span>
        )}
      </div>
    </div>
  );
};
