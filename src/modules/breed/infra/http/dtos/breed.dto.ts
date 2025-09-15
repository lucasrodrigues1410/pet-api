import { z } from "zod";

export const breedDto = z.object({
	id: z.string(),
	animalTypeId: z.string(),
	name: z.string(),
});
