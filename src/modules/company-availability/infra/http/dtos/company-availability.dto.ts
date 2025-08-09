import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const upsertCompanyAvailabilityBody = z.object({
  startTime: z.string().regex(timeRegex, { message: "Formato HH:mm" }),
  endTime: z.string().regex(timeRegex, { message: "Formato HH:mm" }),
  lunchStartTime: z.string().regex(timeRegex, { message: "Formato HH:mm" }),
  lunchEndTime: z.string().regex(timeRegex, { message: "Formato HH:mm" }),
});

export class UpsertCompanyAvailabilityBodyDto extends createZodDto(
  upsertCompanyAvailabilityBody,
) {}

export const companyAvailabilityResponse = z.object({
  companyId: z.string(),
  day: z.enum([
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ]),
  timeRange: z.object({ startTime: z.string(), endTime: z.string() }),
  launchTime: z.object({ startTime: z.string(), endTime: z.string() }),
});

export class CompanyAvailabilityResponseDto extends createZodDto(
  companyAvailabilityResponse,
) {}

export const companyAvailabilityListResponse = z.array(companyAvailabilityResponse);
export class CompanyAvailabilityListResponseDto extends createZodDto(
  companyAvailabilityListResponse,
) {}


