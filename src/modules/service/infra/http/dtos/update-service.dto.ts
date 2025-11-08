import { createZodDto } from "nestjs-zod";
import z from "zod";

const requestDto = z.object({
	name: z.string().min(1).optional(),
	description: z.string().min(1).optional(),
	price: z.number().min(0).optional(),
	duration: z.number().min(0).optional(),
	rules: z.string().optional(),
	categoryId: z.string().optional(),
	requiresPayment: z.boolean().optional(),
	isActive: z.boolean().optional(),
});

export class UpdateServiceRequestDto extends createZodDto(requestDto) {}
