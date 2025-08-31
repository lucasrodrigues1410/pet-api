import { createZodDto } from "nestjs-zod";
import z from "zod";

const requestDto = z.object({
	name: z.string().min(1),
	description: z.string().min(1),
	price: z.number().min(0),
	duration: z.number().min(0),
	rules: z.string().optional(),
	categoryId: z.string().optional(),
});

export class CreateServiceRequestDto extends createZodDto(requestDto) {}
