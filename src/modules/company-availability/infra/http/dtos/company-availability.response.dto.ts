import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { DaysOfWeek } from "../../../domain/entities/company-availability.entity";

const response = z.object({
	companyId: z.string(),
	day: z.enum(DaysOfWeek),
	timeRange: z.object({ startTime: z.iso.time(), endTime: z.iso.time() }),
	launchTime: z.object({ startTime: z.iso.time(), endTime: z.iso.time() }),
});
const listResponse = z.object({
	items: z.array(response),
});

export class CompanyAvailabilityResponseDto extends createZodDto(response) {}
export class CompanyAvailabilityListResponseDto extends createZodDto(
	listResponse,
) {}
