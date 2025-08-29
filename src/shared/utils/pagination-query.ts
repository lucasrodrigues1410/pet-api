import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const paginationQuerySchema = z.object({
	page: z.coerce
		.number()
		.min(1, { message: "A página deve ser maior que 0" })
		.optional(),
	limit: z.coerce
		.number()
		.min(1, { message: "O limite deve ser maior que 0" })
		.max(100, { message: "O limite deve ser menor que 100" })
		.optional(),
});

export class PaginationQueryDto extends createZodDto(paginationQuerySchema) {}
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
