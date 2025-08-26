import { z } from "zod";
import { CategoryType } from "@/modules/category/domain/entities/category.entity";

export const categoryDto = z.object({
	id: z.string(),
	name: z.string(),
	type: z.enum(CategoryType),
	description: z.string().nullish(),
});
