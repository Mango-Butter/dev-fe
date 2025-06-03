// utils/date.ts
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

import { getKSTDate, getKSTISOString } from "../libs/date";

/**
 * Date를 'YYYY-MM-DD' 형식의 문자열로 변환하는 함수 (KST 기준)
 */
export const formatFullDate = (date: Date): string =>
  dayjs(date).tz("Asia/Seoul").format("YYYY-MM-DD");

/**
 * Date를 'YYYY년 MM월 DD일' 형식의 문자열로 변환하는 함수 (KST 기준)
 */
export const formatKRDate = (date: Date): string =>
  dayjs(date).tz("Asia/Seoul").format("MM월 DD일");

/**
 * Date를 '2024년 1월 1일 월요일 오전 9시 30분' 형식의 문자열로 변환 (로컬 기준이지만 한국어 표기 목적)
 */
export const formatFullDateWithTime = (date: Date): string => {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
    hour: "numeric",
    minute: "numeric",
    timeZone: "Asia/Seoul",
  }).format(date);
};

/**
 * 문자열로 주어진 두 시간의 차이를 분 단위로 계산 (KST 기준)
 */
export const getMinutesDiff = (a: string, b: string): number => {
  const dateA = dayjs(a).tz("Asia/Seoul");
  const dateB = dayjs(b).tz("Asia/Seoul");
  return Math.abs(dateA.diff(dateB, "minute"));
};

/**
 * 주어진 날짜 기준으로 해당 월의 1일~말일 범위를 KST 기준으로 반환
 */
export const getCalendarRange = (
  viewDate: Date,
): { start: string; end: string } => {
  const base = dayjs(viewDate).tz("Asia/Seoul");
  const start = base.startOf("month").format("YYYY-MM-DD");
  const end = base.endOf("month").format("YYYY-MM-DD");
  return { start, end };
};

/**
 * 주어진 연월(YYYY-MM) 기준으로 KST 시작일과 종료일을 반환
 */
export const getStartAndEndDates = (ym: string): [string, string] => {
  const [year, month] = ym.split("-").map(Number);
  const base = dayjs.tz(
    `${year}-${String(month).padStart(2, "0")}-01`,
    "Asia/Seoul",
  );
  const start = base.startOf("month").format("YYYY-MM-DD");
  const end = base.endOf("month").format("YYYY-MM-DD");
  return [start, end];
};

/**
 * 오늘 일(day) 기준으로 송금일까지 남은 일 수 계산
 */
export const getRemainingDays = (transferDate: number): number => {
  const today = getKSTDate();
  return today.getDate() - transferDate;
};

/**
 * 기존 getKoreaISOString은 deprecated 처리
 */
export const getKoreaISOString = (): string => {
  console.warn(
    "getKoreaISOString은 deprecated 되었으니 getKSTISOString을 사용하세요.",
  );
  return getKSTISOString();
};
