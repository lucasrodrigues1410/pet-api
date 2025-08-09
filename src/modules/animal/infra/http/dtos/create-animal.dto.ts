import { createZodDto } from "nestjs-zod";
import z from "zod";
import { animalDto } from "./animal.dto";

const request = z.object({
	...animalDto
		.pick({
			name: true,
			breedId: true,

			weight: true,
		})
		.required().shape,
	birthdate: z.iso.date().optional(),
});

export class CreateAnimalRequestDto extends createZodDto(request) {}
