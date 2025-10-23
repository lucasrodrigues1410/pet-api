import { z } from "zod";

export const userDto = z.object({
	id: z.string(),
	email: z.email(),
	name: z.string(),
});
