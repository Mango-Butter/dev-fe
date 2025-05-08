// utils/date.ts

// 타입 분리
export type SingleDate = Date | null;
export type RangeDate = [Date | null, Date | null];

/**
 * Date를 'YYYY-MM-DD' 형식의 문자열로 변환하는 함수
 * @param date 변환할 Date
 * @param separator 연결자
 * @returns 'YYYY-MM-DD' 형식의 문자열
 * @example
 * formatFullDate(new Date(), "-"); // '2022-10-10'
 * formatFullDate(new Date(), "/"); // '2022/10/10'
 * formatFullDate(new Date(), "."); // '2022.10.10'
 */
export const formatFullDate = (date: Date, separator: string = "-"): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return [year, month, day].join(separator);
};

/**
 * Date를 '2024년 1월 1일 월요일 오전 9시 30분' 형식의 문자열로 변환하는 함수
 * @param date 변환할 Date
 * @returns 한국어 날짜 시간 형식의 문자열
 */
export const formatFullDateWithTime = (date: Date): string => {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
    hour: "numeric",
    minute: "numeric",
  }).format(date);
};

/**
 * SingleDate 또는 RangeDate를 받아서
 * 시작일, 종료일을 'YYYY-MM-DD' 형식으로 변환한 배열 반환
 * @param pickedDate SingleDate 또는 RangeDate
 * @param separator 연결자 (기본: '-')
 * @returns [시작일, 종료일] 문자열 배열
 */
export const getPickedDateArr = (
  pickedDate: SingleDate | RangeDate,
  separator: string = "-",
): [string, string] => {
  if (pickedDate instanceof Date) {
    return [formatFullDate(pickedDate, separator), ""];
  }

  if (Array.isArray(pickedDate)) {
    const [start, end] = pickedDate;
    return [
      start ? formatFullDate(start, separator) : "",
      end ? formatFullDate(end, separator) : "",
    ];
  }

  return ["", ""];
};

/**
 * SingleDate 또는 RangeDate를 받아서
 * 선택된 날짜 수(일수 차이)를 계산하는 함수
 * @param pickedDate SingleDate 또는 RangeDate
 * @returns 일수 차이 (하루 선택 시 1 반환)
 */
export const calculateDiffDays = (
  pickedDate: SingleDate | RangeDate,
): number => {
  if (pickedDate instanceof Date) {
    return 1;
  }

  if (Array.isArray(pickedDate)) {
    const [start, end] = pickedDate;
    if (start && end) {
      const diffTime = Math.abs(end.getTime() - start.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
  }

  return 0;
};

/**
 * 문자열로 주어진 두 날짜를 비교해서
 * 일수 차이를 계산하는 함수
 * @param startDate 시작일 (YYYY-MM-DD 문자열)
 * @param endDate 종료일 (YYYY-MM-DD 문자열)
 * @returns 일수 차이
 */
export const calculateDiffDaysWithStr = (
  startDate: string,
  endDate: string,
): number => {
  if (!startDate || !endDate) return 0;

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;

  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * 문자열로 주어진 두 시간를 비교해서
 * 시간 차이를 계산하는 함수
 */
export const getMinutesDiff = (a: string, b: string): number => {
  const dateA = new Date(a);
  const dateB = new Date(b);
  return Math.abs(
    Math.floor((dateA.getTime() - dateB.getTime()) / (1000 * 60)),
  );
};

// 보고 있는 날짜의 달의 시작일과 종료일 반환
export const getCalendarRange = (
  viewDate: Date,
): { start: string; end: string } => {
  const start = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  const end = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0);

  const format = (d: Date) => d.toISOString().split("T")[0]; // YYYY-MM-DD
  return { start: format(start), end: format(end) };
};

/**
 * 한국(KST) 기준으로 날짜를 'YYYY-MM-DD' 형식 문자열로 반환
 * @param date Date 객체
 * @returns KST 기준 YYYY-MM-DD 문자열
 */
export const formatDateToKSTString = (date: Date): string => {
  const offset = date.getTimezoneOffset() * 60000;
  const local = new Date(date.getTime() - offset); // 타임존 보정
  return local.toISOString().slice(0, 10); // 잘라내기
};
