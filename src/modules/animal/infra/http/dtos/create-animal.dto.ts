import { createZodDto } from "nestjs-zod";
import z from "zod";

const request = z.object({
	name: z.string(),
	weight: z.number(),
	breedId: z.string(),
	age: z.number().optional(),
});

const response = z.object({
	id: z.string(),
});

export class CreateAnimalRequestDto extends createZodDto(request) {}
export class CreateAnimalResponseDto extends createZodDto(response) {}
