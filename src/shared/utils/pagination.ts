import { ZodSchema, z } from "zod";

export const PaginationMetaDto = z.object({
	total: z.number(),
	page: z.number(),
	limit: z.number(),
	totalPages: z.number(),
});
export type PaginationMeta = z.infer<typeof PaginationMetaDto>;

export function PaginatedDto<ItemSchema extends ZodSchema>(
	itemSchema: ItemSchema,
) {
	return z.object({
		items: z.array(itemSchema),
		meta: PaginationMetaDto,
	});
}

export type PaginatedDtoType<T extends ZodSchema> = z.infer<
	ReturnType<typeof PaginatedDto<T>>
>;
export type PaginationResult<T> = {
	items: T[];
	meta: PaginationMeta;
};
