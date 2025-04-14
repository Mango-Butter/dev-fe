import { z } from "zod";

export const signupSchema = z.object({
  name: z.string(),
  phone: z.string(),
  email: z.string(),
  birth: z.string(),
  isAgreeTerms: z.boolean().refine((val) => val, {
    message: "서비스 이용약관에 동의해주세요.",
  }),
  isAgreePrivacy: z.boolean().refine((val) => val, {
    message: "개인정보 처리방침에 동의해주세요.",
  }),
  isAgreeLocation: z.boolean().refine((val) => val, {
    message: "위치 정보 수집에 동의해주세요.",
  }),
  isAgreeCamera: z.boolean().refine((val) => val, {
    message: "카메라 사용 권한에 동의해주세요.",
  }),
});

export type SignupFormValues = z.infer<typeof signupSchema>;
