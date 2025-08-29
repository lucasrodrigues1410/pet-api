import { z } from "zod";

export const paginationMetaDto = z.object({
	total: z.number(),
	page: z.number(),
	limit: z.number(),
	totalPages: z.number(),
});

export const makePaginatedDto = <T extends z.ZodType>(schema: T) =>
	z.object({
		items: z.array(schema),
		meta: paginationMetaDto,
	});

export type PaginationMeta = z.infer<typeof paginationMetaDto>;
export type PaginationResult<T> = {
	items: T[];
	meta: PaginationMeta;
};
