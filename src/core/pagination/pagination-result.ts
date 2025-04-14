import { ZodTypeAny, z } from "zod";

export const paginationResultSchema = <T extends ZodTypeAny>(itemSchema: T) =>
	z.object({
		items: z.array(itemSchema),
		total: z.number(),
		page: z.number(),
		limit: z.number(),
		totalPages: z.number(),
	});

export type PaginationResult<T> = {
	items: T[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
};
