import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const serviceByIdResponse = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().nullable(),
	price: z.number(),
	categories: z.array(
		z.object({
			id: z.string(),
			name: z.string(),
			type: z.enum(["PETSHOP"]),
		}),
	),
	company: z.object({
		id: z.string(),
		name: z.string(),
	}),
});

export class ServiceByIdResponseDTO extends createZodDto(serviceByIdResponse) {}
