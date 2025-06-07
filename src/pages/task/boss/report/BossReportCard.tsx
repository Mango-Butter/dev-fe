import React from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { WorkReportItem } from "../../../../types/report";

const formatDateTime = (dateTime: string) => {
  const date = new Date(dateTime);
  return format(date, "yyyy-MM-dd HH:mm");
};

const BossReportCard: React.FC<WorkReportItem> = ({
  workReportId,
  content,
  reportImageUrl,
  createdAt,
  staff,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/boss/report/${workReportId}`);
  };

  return (
    <div
      className="w-full flex justify-between bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50"
      onClick={handleClick}
    >
      <div className="w-full flex flex-col items-start gap-2">
        <p className="body-2 text-gray-800 line-clamp-2">{content}</p>
        <div className="flex items-center gap-2">
          <img
            src={staff.profileImageUrl}
            alt={staff.name}
            className="w-4 h-4 rounded-full"
          />
          <span className="body-3 text-gray-700">{staff.name}</span>
          <span className="body-3 text-gray-400">|</span>
          <span className="body-3 text-gray-400">
            {formatDateTime(createdAt)}
          </span>
        </div>
      </div>
      {reportImageUrl && (
        <img
          src={reportImageUrl}
          alt="보고 이미지"
          className="w-14 h-14 rounded-lg object-cover ml-3"
        />
      )}
    </div>
  );
};

export default BossReportCard;
