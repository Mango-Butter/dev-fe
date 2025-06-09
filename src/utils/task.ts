import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { DayOfWeek } from "../types/task";
import { parseDateStringToKST } from "../libs/date.ts";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const formatTaskTime = (time: string): string => {
  return format(parseDateStringToKST(time), "HH:mm");
};

export const formatTaskDate = (date: string): string => {
  return format(parseDateStringToKST(date), "M월 d일", { locale: ko });
};

export const getDayOfWeekText = (day: DayOfWeek): string => {
  switch (day) {
    case "MONDAY":
      return "월요일";
    case "TUESDAY":
      return "화요일";
    case "WEDNESDAY":
      return "수요일";
    case "THURSDAY":
      return "목요일";
    case "FRIDAY":
      return "금요일";
    case "SATURDAY":
      return "토요일";
    case "SUNDAY":
      return "일요일";
  }
};

export const getFileExtensionFromType = (contentType: string): string => {
  switch (contentType) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/gif":
      return "gif";
    default:
      return "jpg";
  }
};

export const validateImageFile = (file: File): boolean => {
  const validTypes = ["image/jpeg", "image/png", "image/gif"];
  const maxSize = 5 * 1024 * 1024; // 5MB

  return validTypes.includes(file.type) && file.size <= maxSize;
};

export const toISOStringWithTime = (date: Date, time: string): string => {
  const [hour, minute] = time.split(":").map(Number);
  return dayjs(date)
    .tz("Asia/Seoul")
    .hour(hour)
    .minute(minute)
    .second(0)
    .millisecond(0)
    .format("YYYY-MM-DDTHH:mm");
};
