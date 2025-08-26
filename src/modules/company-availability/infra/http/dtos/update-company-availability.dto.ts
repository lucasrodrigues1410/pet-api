import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { DaysOfWeek } from "../../../domain/entities/company-availability.entity";

const upsertBodyDto = z.object({
	startTime: z.iso.time(),
	endTime: z.iso.time(),
	lunchStartTime: z.iso.time(),
	lunchEndTime: z.iso.time(),
});
const upsertParamsDto = z.object({
	companyId: z.string(),
	day: z.enum(DaysOfWeek),
});

export class UpsertCompanyAvailabilityBodyDto extends createZodDto(upsertBodyDto) {}
export class CompanyAvailabilityParamsDto extends createZodDto(upsertParamsDto) {}
