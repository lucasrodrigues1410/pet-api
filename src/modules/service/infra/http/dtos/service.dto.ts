import { z } from "zod";

export const serviceDto = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().optional(),
	price: z.number(),
	isActive: z.boolean(),
	duration: z.number().optional(),
	companyId: z.string(),
	details: z.record(z.string(), z.unknown()).optional(),
	priceRange: z
		.object({
			min: z.number(),
			max: z.number(),
		})
		.default({ min: 0, max: 0 }),
});
