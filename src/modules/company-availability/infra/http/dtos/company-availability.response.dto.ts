import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { companyAvailabilityDto } from "./company-availability.dto";

const listResponse = z.object({
	items: z.array(companyAvailabilityDto),
});

export class CompanyAvailabilityResponseDto extends createZodDto(
	companyAvailabilityDto,
) {}
export class CompanyAvailabilityListResponseDto extends createZodDto(
	listResponse,
) {}
