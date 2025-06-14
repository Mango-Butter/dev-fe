// libs/date.ts
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

// 1. KST 기준 현재 시간 객체 반환
export const getKSTDate = (): Date => {
  return dayjs().tz("Asia/Seoul").toDate();
};

// 2. KST 기준 ISO 문자열 반환
export const getKSTISOString = (): string => {
  return dayjs().tz("Asia/Seoul").format("YYYY-MM-DDTHH:mm:ss");
};

export const parseDateStringToKST = (dateStr: string): Date =>
  dayjs.tz(dateStr, "Asia/Seoul").toDate();

export const formatDateToKSTString = (date: Date): string =>
  dayjs(date).tz("Asia/Seoul").format("YYYY-MM-DD");

export const getKSTISOStringFromDateAndTime = (
  dateStr: string,
  timeStr: string,
): string => {
  return dayjs(`${dateStr} ${timeStr}`).format("YYYY-MM-DDTHH:mm:ss");
};
