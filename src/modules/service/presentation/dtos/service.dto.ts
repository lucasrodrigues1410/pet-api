import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const serviceSchema = z.object({
	id: z.number(),
	name: z.string(),
	description: z.string().nullable(),
	price: z.number(),
});

export class ServiceDto extends createZodDto(serviceSchema) {}