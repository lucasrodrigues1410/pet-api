import { paginationResultSchema } from "@/core/pagination/pagination-result";
import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";

const searchCompaniesResponse = paginationResultSchema(
	z.object({
		id: z.string(),
		name: z.string(),
	}),
);

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

export class SearchCompaniesResponseDto extends createZodDto(
	searchCompaniesResponse,
) {}
