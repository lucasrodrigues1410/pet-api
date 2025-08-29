import { createZodDto } from "nestjs-zod";
import z from "zod";

const requestDto = z.object({
	companyId: z.string(),
	rating: z.number().min(1).max(5),
	comment: z.string().optional(),
});

export class CreateRatingRequestDto extends createZodDto(requestDto) {}