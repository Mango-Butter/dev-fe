export interface CreateSingleScheduleRequest {
  staffId: number;
  workDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
}

export interface DailySingleSchedule {
  staff: {
    staffId: number;
    name: string;
    profileImageUrl: string;
  };
  schedule: {
    workDate: string;
    startTime: string;
    endTime: string;
  };
}
