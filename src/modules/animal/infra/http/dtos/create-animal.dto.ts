import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const createAnimalRequest = z.object({
	name: z.string(),
	breedId: z.string(),
	birthdate: z.iso.date(),
	weight: z.number().min(0),
});

export class CreateAnimalRequestDto extends createZodDto(createAnimalRequest) {}