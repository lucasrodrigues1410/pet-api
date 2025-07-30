import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const updateAnimalRequest = z.object({
	name: z.string().nullish(),
	birthdate: z.iso.date().nullish(),
	weight: z.number().min(0).nullish(),
	assetId: z.string().nullish(),
});

export class UpdateAnimalRequestDto extends createZodDto(updateAnimalRequest) {}
