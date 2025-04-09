import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";

export const paginationParams = z.object({
	page: z
		.string()
		.refine((val) => !Number.isNaN(Number(val)), {
			message: "Page must be a number",
		})
		.transform((val) => Number(val))
		.refine((val) => val > 0, {
			message: "Page must be greater than 0",
		})
		.optional()
		.default("1"),
	limit: z
		.string()
		.refine((val) => !Number.isNaN(Number(val)), {
			message: "Limit must be a number",
		})
		.transform((val) => Number(val))
		.refine((val) => val > 0, {
			message: "Limit must be greater than 0",
		})
		.optional()
		.default("10"),
});

export type PaginationParams = z.output<typeof paginationParams>;
export class PaginationParamsQuery extends createZodDto(paginationParams) {}
