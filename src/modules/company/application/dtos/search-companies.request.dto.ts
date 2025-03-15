import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const searchCompaniesResponse = z.object({
	results: z.array(
		z.object({
			id: z.number(),
			name: z.string(),
		}),
	),
});

export class SearchCompaniesResponseDto extends createZodDto(
	searchCompaniesResponse,
) {}
