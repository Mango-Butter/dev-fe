type RoundMode = "default" | "hour" | "half";

/**
 * 현재 시각을 기준으로 시작/종료 시간을 계산합니다.
 * @param mode - 'default' | 'hour' | 'half'
 * @returns { startTime, endTime } (HH:mm 형식)
 */
export const getDefaultScheduleTimes = (
  mode: RoundMode = "default",
): { startTime: string; endTime: string } => {
  const now = new Date();
  let hour = now.getHours() + 1;
  let minute = now.getMinutes();

  const pad = (n: number) => String(n).padStart(2, "0");

  if (mode === "hour") {
    // 시간 단위 반올림
    if (minute >= 30) hour += 1;
    minute = 0;
  } else if (mode === "half") {
    // 30분 단위 반올림
    if (minute >= 45) {
      hour += 1;
      minute = 0;
    } else if (minute >= 15) {
      minute = 30;
    } else {
      minute = 0;
    }
  }

  const startTime = `${pad(hour % 24)}:${pad(minute)}`;
  const endTime = `${pad((hour + 1) % 24)}:${pad(minute)}`;

  return { startTime, endTime };
};

/**
 * 시간 문자열에서 HH:mm만 추출 ('09:00:00' or ISO 문자열 포함 대응)
 */
export const extractTime = (timeStr: string): string => {
  // ISO 형식인 경우: "2024-05-08T09:00:00" 또는 "09:00:00"
  const match = timeStr.match(/(\d{2}:\d{2})/);
  return match ? match[1] : "00:00";
};

/**
 * 시간 범위를 'HH:mm ~ HH:mm' 형식으로 반환
 */
export const formatTimeRange = (start: string, end: string): string => {
  return `${extractTime(start)} ~ ${extractTime(end)}`;
};
