import { z } from "zod";
import { getKSTDate } from "../libs/date.ts";
import { dayOfWeekList } from "../types/staff.ts";

// 공통 필드
const baseFields = {
  title: z.string().min(1).max(32),
  description: z.string().optional(),
  photoRequired: z.boolean(),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  referenceImageUrl: z.string().optional(),
};

// ONCE: 단일 업무
const onceSchema = z.object({
  ...baseFields,
  taskRoutineRepeatType: z.literal("ONCE"),
  startDate: z.date(),
  endDate: z.date(), // 사용하지 않지만 폼 구조상 필요
});

// DAILY: 매일 반복
const dailySchema = z.object({
  ...baseFields,
  taskRoutineRepeatType: z.literal("DAILY"),
  startDate: z.date(),
  endDate: z.date(),
});

// WEEKLY: 주간 반복
const weeklySchema = z.object({
  ...baseFields,
  taskRoutineRepeatType: z.literal("WEEKLY"),
  startDate: z.date(),
  endDate: z.date(),
  repeatRule: z.object({
    repeatDays: z.array(z.enum(dayOfWeekList)).nonempty("하나 이상 선택하세요"),
  }),
});

// MONTHLY: 월간 반복
const monthlySchema = z.object({
  ...baseFields,
  taskRoutineRepeatType: z.literal("MONTHLY"),
  startDate: z.date(),
  endDate: z.date(),
  repeatRule: z.object({
    repeatDates: z
      .array(z.number().min(1).max(31))
      .nonempty("하나 이상 선택하세요"),
  }),
});

// 통합 스키마
export const taskAddSchema = z.discriminatedUnion("taskRoutineRepeatType", [
  onceSchema,
  dailySchema,
  weeklySchema,
  monthlySchema,
]);

// 타입 정의
export type TaskAddFormValues = z.infer<typeof taskAddSchema> & {
  referenceImageFile?: File | null;
};

// 기본값 생성 함수
export const getDefaultTaskAddFormValues = (): TaskAddFormValues => ({
  title: "",
  description: "",
  photoRequired: false,
  taskRoutineRepeatType: "ONCE",
  startDate: getKSTDate(),
  endDate: getKSTDate(),
  startTime: "",
  endTime: "",
  referenceImageUrl: "",
});
