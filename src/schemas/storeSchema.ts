import { z } from "zod";

export const storeSchema = z.object({
  storeName: z.string().min(1, "매장명을 입력해주세요."),
  businessNumber: z
    .string()
    .length(10, "사업자등록번호는 10자리입니다.")
    .regex(/^\d+$/, "숫자만 입력해주세요."),
  address: z.string().min(1, "주소를 입력해주세요."),
  storeType: z.enum(["CAFE", "RESTAURANT", "CONVENIENCE_STORE"]),
  latitude: z.number(),
  longitude: z.number(),
  overtimeLimit: z
    .number({
      required_error: "연장 근무 한도를 입력해주세요.",
      invalid_type_error: "숫자를 입력해주세요.",
    })
    .min(0, "연장 근무 한도는 0 이상이어야 합니다."),
});

export type StoreFormValues = z.infer<typeof storeSchema>;
