import { z } from "zod";
import { serviceDto } from "./service.dto";
import { companyDto } from "@/modules/company/infra/http/dtos/company.dto";
import { categoryDto } from "@/modules/category/infra/http/dtos/category.dto";

export const serviceDetatilsDto = serviceDto.and(
	z.object({
		company: companyDto,
		categories: z.array(categoryDto),
	}),
);
