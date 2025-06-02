// src/pages/alarm/components/AttendanceRequestCard.tsx
import { toast } from "react-toastify";
import { AttendanceEditRequest } from "../../types/notification.ts";
import {
  approveAttendanceEditRequest,
  rejectAttendanceEditRequest,
} from "../../api/boss/alarm.ts";
import Button from "../../components/common/Button.tsx";
import Label from "../../components/common/Label.tsx";
import ArrowIcon from "../../components/icons/ArrowIcon.tsx";
import { useState } from "react";
import clsx from "clsx";
import { clockInStatusLabelMap } from "../../types/attendance.ts";
import dayjs from "dayjs";
import ApproveIcon from "../../components/icons/ApproveIcon.tsx";
import CanceledIcon from "../../components/icons/CanceledIcon.tsx";
import TimeIcon from "../../components/icons/TimeIcon.tsx";

interface Props {
  userType: "boss" | "staff";
  data: AttendanceEditRequest;
  storeId: number;
  refetch: () => void;
}

const AttendanceRequestCard = ({ userType, data, storeId, refetch }: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const formattedCreatedAt = dayjs(data.createdAt).format(
    "YYYY년 MM월 DD일 HH:mm",
  );

  const handleApprove = async () => {
    try {
      await approveAttendanceEditRequest(storeId, data.attendanceEditId);
      toast.success("근태 수정 요청을 승인했어요");
      refetch();
    } catch (e) {
      toast.error("승인에 실패했어요");
    }
  };

  const handleReject = async () => {
    try {
      await rejectAttendanceEditRequest(storeId, data.attendanceEditId);
      toast.success("근태 수정 요청을 거절했어요");
      refetch();
    } catch (e) {
      toast.error("거절에 실패했어요");
    }
  };

  return (
    <div className="flex w-full flex-col justify-start items-start p-5 bg-white shadow-basic rounded-lg">
      <div className="flex w-full justify-between items-start mb-3">
        <Label
          theme="graysolid"
          className="bg-secondary-100 text-secondary-700"
        >
          근태 변경 요청
        </Label>
        <span className="body-4 text-grayscale-500">{formattedCreatedAt}</span>
      </div>
      <div className="title-1 mb-2">{data.staffName}</div>

      <div className="flex gap-2 mb-2">
        <div className="title-3">근무일정</div>
        <div className="title-3">{data.workDate}</div>
      </div>
      <div className="grid grid-cols-[auto_auto_auto_1fr] gap-x-2 gap-y-2 text-sm mb-3">
        <div className="title-3">근무상태</div>
        <div className="body-3 text-grayscale-500">
          {clockInStatusLabelMap[data.originalAttendance.clockInStatus]}
        </div>
        <div className="body-3 text-grayscale-500">→</div>
        <div className="title-3">
          {clockInStatusLabelMap[data.requestedAttendance.clockInStatus]}
        </div>

        <div className="title-3">출근시간</div>
        <div className="body-3 text-grayscale-500">
          {data.originalAttendance.clockInTime?.slice(11, 16) || "-"}
        </div>
        <div className="body-3 text-grayscale-500">→</div>
        <div className="title-3">
          {data.requestedAttendance.clockInTime?.slice(11, 16) || "-"}
        </div>

        <div className="title-3">퇴근시간</div>
        <div className="body-3 text-grayscale-500">
          {data.originalAttendance.clockOutTime?.slice(11, 16) || "-"}
        </div>
        <div className="body-3 text-grayscale-500">→</div>
        <div className="title-3">
          {data.requestedAttendance.clockOutTime?.slice(11, 16) || "-"}
        </div>
      </div>
      <div className="flex w-full justify-between items-center">
        <div
          className={clsx(
            "w-full body-3 text-grayscale-500 transition-all",
            !isExpanded && "line-clamp-1",
          )}
        >
          {data.reason}
        </div>
        <ArrowIcon
          direction={isExpanded ? "up" : "down"}
          className="w-5 h-5 cursor-pointer"
          onClick={() => setIsExpanded((prev) => !prev)}
        />
      </div>

      <div className="flex w-full gap-2 mt-3">
        {data.attendanceEditState === "PENDING" ? (
          userType === "boss" ? (
            <>
              <Button
                theme="outline"
                size="sm"
                className="flex-1"
                onClick={handleReject}
              >
                거절
              </Button>
              <Button
                theme="secondary"
                size="sm"
                className="flex-1 bg-secondary-700"
                onClick={handleApprove}
              >
                승인
              </Button>
            </>
          ) : (
            <div className="flex w-full items-center gap-1 justify-center border-t pt-4 body-2 text-[#6B6B6B]">
              <TimeIcon fill="#6B6B6B" className="w-4 h-4" />
              <div>승인 대기중</div>
            </div>
          )
        ) : data.attendanceEditState === "APPROVED" ? (
          <div className="flex w-full items-center gap-1 justify-center border-t pt-4 body-2 text-[#6B6B6B]">
            <ApproveIcon fill="#6B6B6B" className="w-4 h-4" />
            <div>승인됨</div>
          </div>
        ) : (
          <div className="flex w-full items-center gap-1 justify-center border-t pt-4 body-2 text-[#6B6B6B]">
            <CanceledIcon fill="#6B6B6B" className="w-4 h-4" />
            <p>거절됨</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceRequestCard;
