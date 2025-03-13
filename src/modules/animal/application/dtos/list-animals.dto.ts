import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const listAnimalsResponse = z.object({
	results: z.array(
		z.object({
			id: z.number(),
			name: z.string(),
			breed: z.object({
				name: z.string(),
			}),
			birthdate: z.string().nullable(),
			weight: z.number(),
		}),
	),
});

export class ListAnimalsResponseDto extends createZodDto(listAnimalsResponse) {}
