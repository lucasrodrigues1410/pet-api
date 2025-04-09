import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";

const searchCompaniesRequest = z.object({
	location: z
		.object({
			latitude: z.number(),
			longitude: z.number(),
		})
		.optional(),
	query: z.string().optional(),
	page: z.number().min(1).optional(),
});

export class SearchCompaniesRequestDto extends createZodDto(
	searchCompaniesRequest,
) {}
