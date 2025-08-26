import { z } from "zod";

export const animalDto = z.object({
	id: z.string(),
	name: z.string(),
	age: z.number().nullish(),
	weight: z.number().nullish(),
	userId: z.string(),
	assetId: z.string().nullish(),
	breedId: z.string().nullish(),
});
