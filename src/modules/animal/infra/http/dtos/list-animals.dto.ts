import { paginationResultSchema } from "@/core/pagination/pagination-result";
import { createZodDto } from "@anatine/zod-nestjs";
import { extendApi } from "@anatine/zod-openapi";
import { z } from "zod";

const listAnimalsResponse = extendApi(
	paginationResultSchema(
		z.object({
			id: z.string(),
			name: z.string(),
			breed: z.object({
				name: z.string(),
			}),
			birthdate: z.string().nullable(),
			weight: z.number(),
			image: z
				.object({
					url: z.string(),
					thumbnailUrl: z.string().optional(),
					width: z.number().optional(),
					height: z.number().optional(),
				})
				.optional(),
		}),
	),
	{
		title: "List animals response",
		description: "List animals response",
	},
);

export class ListAnimalsResponseDto extends createZodDto(listAnimalsResponse) {}
