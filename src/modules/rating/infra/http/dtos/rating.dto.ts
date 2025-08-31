import { z } from "zod";

export const ratingDto = z.object({
	id: z.string(),
	companyId: z.string(),
	userId: z.string(),
	rating: z.number().min(1).max(5),
	comment: z.string().optional(),
	createdAt: z.iso.datetime(),
	user: z
		.object({
			id: z.string(),
			name: z.string(),
		})
		.optional(),
});

export const ratingDistributionDto = z.object({
	rating: z.number().min(1).max(5),
	count: z.number(),
});

export const companyRatingStatsDto = z.object({
	averageRating: z.number(),
	totalRatings: z.number(),
	distribution: z.array(ratingDistributionDto),
});
