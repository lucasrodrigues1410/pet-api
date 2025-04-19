import { z } from "zod";

export const assetDto = z.object({
	id: z.string(),
	url: z.string(),
	thumbnailUrl: z.string().optional(),
	userId: z.string(),
});
