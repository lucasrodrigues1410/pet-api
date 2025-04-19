import { categoryDto } from "@/modules/category/infra/http/dtos/category.dto";
import { companyDto } from "@/modules/company/infra/http/dtos/company.dto";
import { z } from "zod";
import { serviceDto } from "./service.dto";

export const serviceDetailsDto = serviceDto.and(
	z.object({
		company: companyDto,
		categories: z.array(categoryDto),
	}),
);
