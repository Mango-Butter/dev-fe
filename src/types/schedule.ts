export type CreateScheduleRequest = {
  staffId: number;
  workDate: string; // yyyy-MM-dd
  startTime: string; // HH:mm:ss
  endTime: string; // HH:mm:ss
};

export type DailyScheduleResponse = {
  result: {
    staff: {
      staffId: number;
      staffName: string;
      staffProfileUrl: string;
    };
    schedule: {
      workDate: string; // yyyy-MM-dd
      startTime: string; // yyyy-MM-ddTHH:mm:ss
      endTime: string; // yyyy-MM-ddTHH:mm:ss
    };
  }[];
};

export type CreateRegularScheduleRequest = {
  dayOfWeek:
    | "SUNDAY"
    | "MONDAY"
    | "TUESDAY"
    | "WEDNESDAY"
    | "THURSDAY"
    | "FRIDAY"
    | "SATURDAY";
  repeatStartDate: string; // yyyy-MM-dd
  repeatEndDate: string; // yyyy-MM-dd
  startTime: string; // HH:mm:ss
  endTime: string; // HH:mm:ss
}[];

export type RegularSchedule = {
  regularGroupId: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  startDate: string;
  endDate: string;
};

export type GetRegularScheduleResponse = {
  result: RegularSchedule[];
};
