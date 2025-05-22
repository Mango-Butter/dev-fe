// utils/date.ts

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

export const getStartAndEndDates = (ym: string): [string, string] => {
  const [year, month] = ym.split("-").map(Number);
  const startUtc = new Date(Date.UTC(year, month - 1, 1));
  const endUtc = new Date(Date.UTC(year, month, 0));

  const offset = 9 * 60 * 60 * 1000;
  const startKst = new Date(startUtc.getTime() + offset);
  const endKst = new Date(endUtc.getTime() + offset);

  const format = (d: Date) => d.toISOString().slice(0, 10); // YYYY-MM-DD
  return [format(startKst), format(endKst)];
};

// 오늘 일(day) 기준으로 송금일(transferDate)까지 남은 일 수 계산
export const getRemainingDays = (transferDate: number): number => {
  const today = new Date(getKoreaISOString());
  const todayDate = today.getDate(); // 오늘의 일(day) 숫자만

  return transferDate - todayDate;
};

export const getKoreaISOString = (): string => {
  const date = new Date();
  const kstTime = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return kstTime.toISOString();
};
