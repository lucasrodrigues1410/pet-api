import { createZodDto } from "nestjs-zod";
import z from "zod";
import { animalDto } from "./animal.dto";

const request = z.object({
	...animalDto
		.pick({
			name: true,
			weight: true,
		})
		.partial().shape,
	birthdate: z.iso.date().optional(),
});

export class UpdateAnimalRequestDto extends createZodDto(request) {}
