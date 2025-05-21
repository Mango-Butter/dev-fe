// 출근 상태별 텍스트 및 색상 설정 유틸
import { cn } from "../libs";

export const getClockInStyle = (
  status: "NORMAL" | "LATE" | "ABSENT" | null | undefined,
  hasClockOut: boolean,
) => {
  if (status === "NORMAL") {
    return {
      label: hasClockOut ? "출근" : "근무 중",
      className: cn("text-positive"),
      dotClassName: cn("bg-positive"),
    };
  }
  if (status === "LATE") {
    return {
      label: "지각",
      className: cn("text-delay"),
      dotClassName: cn("bg-delay"),
    };
  }
  if (status === "ABSENT") {
    return {
      label: "결근",
      className: cn("text-warning"),
      dotClassName: cn("bg-warning"),
    };
  }
  return {
    label: "출근 전",
    className: cn("text-gray-500"),
    dotClassName: cn("bg-gray-500"),
  };
};

export const getClockOutStyle = (
  status: "NORMAL" | "EARLY_LEAVE" | "OVERTIME" | null | undefined,
) => {
  if (status === "NORMAL") {
    return {
      label: "정상 퇴근",
      className: cn("text-positive"),
      dotClassName: cn("bg-positive"),
    };
  }

  if (status === "EARLY_LEAVE") {
    return {
      label: "조기 퇴근",
      className: cn("text-warning"),
      dotClassName: cn("bg-warning"),
    };
  }

  if (status === "OVERTIME") {
    return {
      label: "연장 근무",
      className: cn("text-purple-500"),
      dotClassName: cn("bg-purple-500"),
    };
  }

  return {
    label: "퇴근 전",
    className: cn("text-gray-500"),
    dotClassName: cn("bg-gray-300"),
  };
};
