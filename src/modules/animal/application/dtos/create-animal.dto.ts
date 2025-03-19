import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const createAnimalRequest = z.object({
	name: z.string(),
	breedId: z.string(),
	birthdate: z.coerce.date().nullish(),
	weight: z.number().min(0),
});

const createAnimalResponse = createAnimalRequest;

export class CreateAnimalResponseDto extends createZodDto(
	createAnimalRequest,
) {}
export class CreateAnimalRequestDto extends createZodDto(
	createAnimalResponse,
) {}
