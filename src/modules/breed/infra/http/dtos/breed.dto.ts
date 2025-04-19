import { z } from "zod";

export const breedDto = z.object({
	animalTypeId: z.string(),
	name: z.string(),
});
