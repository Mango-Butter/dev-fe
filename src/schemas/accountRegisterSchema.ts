// src/schemas/accountRegisterSchema.ts
import { z } from "zod";

export const accountRegisterSchema = z.object({
  bankName: z.literal("농협은행"),
  accountNumber: z.string().min(10, "계좌번호를 정확히 입력해주세요."),
  birthdate: z.string().regex(/^\d{8}$/, "생년월일은 8자리여야 합니다."),
  password: z.string().regex(/^\d{4}$/, "비밀번호는 4자리 숫자여야 합니다."),
  agreeWithdraw: z.boolean().refine((val) => val === true, {
    message: "출금 동의가 필요합니다.",
  }),
});

export type AccountRegisterForm = z.infer<typeof accountRegisterSchema>;
