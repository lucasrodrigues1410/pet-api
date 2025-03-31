import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const listAnimalsResponse = z.object({
	results: z.array(
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
});

export class ListAnimalsResponseDto extends createZodDto(listAnimalsResponse) {}
