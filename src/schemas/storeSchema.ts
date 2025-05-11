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
});

export type StoreFormValues = z.infer<typeof storeSchema>;

export const storeEditSchema = storeSchema.pick({
  address: true,
  storeType: true,
});

export type StoreEditFormValues = z.infer<typeof storeEditSchema>;
