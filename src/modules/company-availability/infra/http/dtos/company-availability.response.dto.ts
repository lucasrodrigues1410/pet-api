import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const companyAvailabilityResponse = z.object({
	companyId: z.string(),
	day: z.string(),
	timeRange: z.object({ startTime: z.string(), endTime: z.string() }),
	launchTime: z.object({ startTime: z.string(), endTime: z.string() }),
});

export class CompanyAvailabilityResponseDto extends createZodDto(
	companyAvailabilityResponse,
) {}

export const companyAvailabilityListResponse = z.object({
	items: z.array(companyAvailabilityResponse),
});
export class CompanyAvailabilityListResponseDto extends createZodDto(
	companyAvailabilityListResponse,
) {}
