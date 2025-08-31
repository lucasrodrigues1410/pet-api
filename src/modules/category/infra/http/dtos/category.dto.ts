import { z } from "zod";
import { categoryType } from "@/modules/category/domain/entities/category.entity";

export const categoryDto = z.object({
	id: z.string(),
	name: z.string(),
	type: z.enum(categoryType),
	description: z.string().nullish(),
});
