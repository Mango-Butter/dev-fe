export const dayOfWeekList = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
] as const;

export type DayOfWeek = (typeof dayOfWeekList)[number];

export const weekdayKorean: Record<DayOfWeek, string> = {
  MONDAY: "월",
  TUESDAY: "화",
  WEDNESDAY: "수",
  THURSDAY: "목",
  FRIDAY: "금",
  SATURDAY: "토",
  SUNDAY: "일",
};

// POST 요청용
export interface CreateRegularScheduleDto {
  dayOfWeek: DayOfWeek;
  repeatStartDate: string; // YYYY-MM-DD
  repeatEndDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
}

// GET 응답용
export interface RegularSchedule {
  regularGroupId: number;
  dayOfWeek: DayOfWeek;
  startTime: string; // HH:mm:ss
  endTime: string; // HH:mm:ss
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}
