import { z } from "zod";
import { getKSTDate } from "../libs/date.ts";
import { dayOfWeekList } from "../types/staff.ts";

// 공통 필드
const baseFields = {
  title: z
    .string({ required_error: "업무 제목을 입력해주세요." })
    .min(1, { message: "업무 제목은 1자 이상이어야 해요." })
    .max(32, { message: "업무 제목은 최대 32자까지 입력할 수 있어요." })
    .transform((v) => v.trim()),

  description: z
    .string({ required_error: "업무 설명을 입력해주세요." })
    .min(1, { message: "업무 설명은 1자 이상이어야 해요." })
    .transform((v) => v.trim()),

  photoRequired: z.boolean(),

  startTime: z.string().min(1, { message: "시작 시간을 입력해주세요." }),
  endTime: z.string().min(1, { message: "종료 시간을 입력해주세요." }),

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
    repeatDays: z
      .array(z.enum(dayOfWeekList), { required_error: "요일을 선택해주세요." })
      .nonempty("요일을 하나 이상 선택해주세요."),
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
      .array(z.number().min(1).max(31), {
        required_error: "반복 날짜를 선택해주세요.",
      })
      .nonempty("날짜를 하나 이상 선택해주세요."),
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
