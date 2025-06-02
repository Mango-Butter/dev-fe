import { z } from "zod";

export const payrollSettingsSchema = z.object({
  autoTransferEnabled: z.boolean(),
  transferDate: z.union([z.number(), z.null()]),
  deductionUnit: z.enum(["ZERO_MIN", "FIVE_MIN", "TEN_MIN", "THIRTY_MIN"]),
  commutingAllowance: z.number().min(0),
});

export type PayrollSettingsForm = z.infer<typeof payrollSettingsSchema>;
