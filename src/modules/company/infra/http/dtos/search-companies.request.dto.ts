import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";

const searchCompaniesResponse = z.object({
	results: z.array(
		z.object({
			id: z.string(),
			name: z.string(),
		}),
	),
});

export class SearchCompaniesResponseDto extends createZodDto(
	searchCompaniesResponse,
) {}
