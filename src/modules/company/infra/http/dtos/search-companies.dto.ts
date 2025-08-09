import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const searchCompaniesRequest = z.object({
	location: z
		.object({
			latitude: z.number(),
			longitude: z.number(),
		})
		.optional(),
	query: z.string().optional(),
});

export class SearchCompaniesRequestDto extends createZodDto(
	searchCompaniesRequest,
) {}
