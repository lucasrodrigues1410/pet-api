import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";

export const paginationParams = z.object({
	page: z
		.number({ coerce: true })
		.min(1, { message: "A página deve ser maior que 0" })
		.optional(),
	limit: z
		.number({ coerce: true })
		.min(1, { message: "O limite deve ser maior que 0" })
		.max(100, { message: "O limite deve ser menor que 100" })
		.optional(),
});

export type PaginationParams = z.output<typeof paginationParams>;
export class PaginationParamsQuery extends createZodDto(paginationParams) {}
