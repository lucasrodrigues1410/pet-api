import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const listServicesByCompanyResponse = z.object({
	id: z.number(),
	name: z.string(),
	description: z.string().nullable(),
	price: z.number(),
	categories: z.array(
		z.object({
			id: z.number(),
			name: z.string(),
			type: z.enum(["PETSHOP"]),
		}),
	),
	company: z.object({
		id: z.number(),
		name: z.string(),
	})
});

export class ListServicesByCompanyResponseDto extends createZodDto(
	listServicesByCompanyResponse,
) {}
