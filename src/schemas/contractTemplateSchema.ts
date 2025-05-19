import { z } from "zod";
import { dayOfWeekList } from "../types/staff";

export const contractTemplateSchema = z.object({
  title: z.string().min(1, "템플릿 이름은 필수입니다."),
  range: z.tuple([z.date().nullable(), z.date().nullable()]),
  duty: z.string().optional(),
  weekdays: z.array(z.enum(dayOfWeekList)).optional(),
  time: z
    .record(
      z.enum(dayOfWeekList),
      z.object({
        start: z.string().optional(),
        end: z.string().optional(),
      }),
    )
    .optional(),
  hourlyWage: z.number().optional(),
  bossSignatureKey: z.string().optional(),
});

export type ContractTemplateFormValues = z.infer<typeof contractTemplateSchema>;
