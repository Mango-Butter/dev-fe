// src/schemas/attendanceSchema.ts
import { z } from "zod";

export const qrSchema = z.object({
  attendanceMethod: z.literal("QR"),
  scheduleId: z.string().min(1),
  qrCode: z.string().min(1),
});

export const gpsSchema = z.object({
  attendanceMethod: z.literal("GPS"),
  scheduleId: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
  locationFetchedAt: z.string().datetime(),
});

export const bothSchema = z.object({
  attendanceMethod: z.literal("BOTH"),
  scheduleId: z.string().min(1),
  qrCode: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
  locationFetchedAt: z.string().datetime(),
});

export const schemaUnion = z.union([qrSchema, gpsSchema, bothSchema]);
