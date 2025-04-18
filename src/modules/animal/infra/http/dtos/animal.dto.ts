import { z } from "zod";

export const animalDto = z.object({
	id: z.string(),
	name: z.string(),
	age: z.number().optional(),
	weight: z.number().optional(),
	userId: z.string(),
	assetId: z.string().optional(),
	breedId: z.string().optional(),
});
