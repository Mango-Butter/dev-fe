import React from "react";
import { TaskStatus } from "../../../types/task";
import { formatTaskTime } from "../../../utils/task";
import Label from "../../../components/common/Label";
import { useNavigate } from "react-router-dom";

export const TaskCard: React.FC<TaskStatus> = ({
  taskId,
  title,
  isPhotoRequired,
  startTime,
  endTime,
  taskLog,
  referenceImageUrl,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/boss/task/${taskId}`);
  };

  return (
    <div
      className="flex justify-between bg-white rounded-lg p-4 shadow-sm border border-gray-200 mb-2 cursor-pointer hover:bg-gray-50"
      onClick={handleClick}
    >
      <div className="flex flex-col justify-between gap-2 items-start">
        <div className="flex items-center gap-3">
          <p className="heading-2">{title}</p>
          <Label theme="ghost" size="lg" className="text-grayscale-500">
            {isPhotoRequired ? "인증샷" : "체크"}
          </Label>
        </div>
        <div className="flex items-center gap-2">
          {taskLog?.checkedStaff && (
            <div className="flex items-center gap-2">
              <img
                src={taskLog.checkedStaff.profileImageUrl}
                alt={taskLog.checkedStaff.name}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm text-gray-600">
                {taskLog.checkedStaff.name}
              </span>
            </div>
          )}
          <span>
            {formatTaskTime(startTime)} - {formatTaskTime(endTime)}
          </span>
        </div>
      </div>
      <div className="flex items-center">
        <span
          className={`p-2 w-12 h-12 rounded-lg body-1 text-center justify-center items-center inline-flex ${
            taskLog ? "bg-gray-100 text-gray-600" : "bg-gray-100 text-gray-800"
          }`}
        >
          {taskLog ? "완료" : "진행"}
        </span>
      </div>
      {referenceImageUrl && (
        <div className="mt-3">
          <img
            src={referenceImageUrl}
            alt="참고 이미지"
            className="w-full h-32 object-cover rounded"
          />
        </div>
      )}
    </div>
  );
};
