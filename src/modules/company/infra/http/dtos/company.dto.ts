import { z } from "zod";
import { assetDto } from "@/modules/asset/infra/http/dtos/asset.dto";

export const companyDto = z.object({
	id: z.string(),
	name: z.string(),
	contact: z.string().nullish(),
	logo: assetDto.optional(),
	averageRating: z.number().nullish(),
	ratingCount: z.number().nullish(),
	description: z.string().nullish(),
});
