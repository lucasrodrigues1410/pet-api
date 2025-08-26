import { createZodDto } from "nestjs-zod";
import z from "zod";

const request = z.object({
	name: z.string(),
	weight: z.number(),
	breedId: z.string(),
	birthdate: z.iso.date().optional(),
});

export class CreateAnimalRequestDto extends createZodDto(request) { }
