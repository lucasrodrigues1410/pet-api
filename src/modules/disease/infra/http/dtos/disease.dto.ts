import { z } from "zod";

export const diseaseDto = z.object({
	id: z.string(),
	name: z.string(),
});
