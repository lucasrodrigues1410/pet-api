import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { daysOfWeek } from "@/modules/company-availability/domain/entities/company-availability.entity";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const upsertCompanyAvailabilityBody = z.object({
	startTime: z.string().regex(timeRegex, { message: "Formato HH:mm" }),
	endTime: z.string().regex(timeRegex, { message: "Formato HH:mm" }),
	lunchStartTime: z.string().regex(timeRegex, { message: "Formato HH:mm" }),
	lunchEndTime: z.string().regex(timeRegex, { message: "Formato HH:mm" }),
});
const companyAvailabilityParams = z.object({
	companyId: z.string(),
	day: z.enum(daysOfWeek),
});


export class UpsertCompanyAvailabilityBodyDto extends createZodDto(
	upsertCompanyAvailabilityBody,
) {}

export class CompanyAvailabilityParamsDto extends createZodDto(
	companyAvailabilityParams,
) {}
