export type TaskRoutineRepeatType = "DAILY" | "WEEKLY" | "MONTHLY";
export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

// 단일 업무 생성 요청
export interface SingleTaskRequest {
  title: string;
  description: string;
  taskDate: string;
  startTime: string;
  endTime: string;
  photoRequired: boolean;
  referenceImageUrl?: string;
}

// 기본 반복 업무 요청 타입
interface BaseTaskRoutineRequest {
  title: string;
  description: string;
  photoRequired: boolean;
  referenceImageUrl?: string;
  startDate: string;
  endDate: string;
}

// 일일 반복 업무 요청
export interface DailyTaskRoutineRequest extends BaseTaskRoutineRequest {
  taskRoutineRepeatType: "DAILY";
  startTime: string;
  endTime: string;
}

// 주간 반복 업무 요청
export interface WeeklyTaskRoutineRequest extends BaseTaskRoutineRequest {
  taskRoutineRepeatType: "WEEKLY";
  repeatRule: {
    repeatDays: DayOfWeek[];
  };
  startTime: string;
  endTime: string;
}

// 월 반복 업무 요청
export interface MonthlyTaskRoutineRequest extends BaseTaskRoutineRequest {
  taskRoutineRepeatType: "MONTHLY";
  repeatRule: {
    repeatDates: number[];
  };
  startTime: string;
  endTime: string;
}

// 통합 반복 업무 요청 타입
export type TaskRoutineRequest =
  | DailyTaskRoutineRequest
  | WeeklyTaskRoutineRequest
  | MonthlyTaskRoutineRequest;

// 참고 사진 업로드 URL 응답
export interface ReferenceImageUploadUrlResponse {
  uploadUrl: string;
  publicUrl: string;
  expiresAt: string;
}

// 업무 상세 조회 응답
export interface TaskDetail {
  taskId: number;
  title: string;
  description: string | null;
  taskDate: string;
  startTime: string;
  endTime: string;
  isPhotoRequired: boolean;
  referenceImageUrl: string | null;
  taskLog: {
    taskLogImageUrl: string | null;
    checkedStaff: {
      staffId: number;
      name: string;
      profileImageUrl: string;
    };
  };
}

// 반복 업무 조회 응답
export interface TaskRoutine {
  id: number;
  title: string;
  description: string;
  repeatType: TaskRoutineRepeatType;
  repeatDays: DayOfWeek[];
  repeatDates: number[];
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  photoRequired: boolean;
  referenceImageUrl: string;
}

// 날짜별 업무 상태 응답
export interface TaskStatus {
  taskId: number;
  title: string;
  description: string | null;
  taskDate: string;
  startTime: string;
  endTime: string;
  isPhotoRequired: boolean;
  referenceImageUrl: string | null;
  taskLog: {
    taskLogImageUrl: string | null;
    checkedStaff: {
      staffId: number;
      name: string;
      profileImageUrl: string;
    };
  };
}

export interface TaskLog {
  taskLogImageUrl: string | null;
  checkedStaff: CheckedStaff | null;
}

export interface CheckedStaff {
  staffId: number;
  name: string;
  profileImageUrl: string;
}

export interface TaskUploadUrlResponse {
  uploadUrl: string;
  publicUrl: string;
  expiresAt: string;
}

export interface StaffTaskListResponse {
  result: TaskStatus[];
}
