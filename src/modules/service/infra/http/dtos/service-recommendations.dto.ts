import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { categoryDto } from "@/modules/category/infra/http/dtos/category.dto";
import { companyDto } from "@/modules/company/infra/http/dtos/company.dto";
import { serviceDto } from "./service.dto";

const serviceRecommendationsResponseSchema = z.object({
	items: z.array(
		serviceDto.extend({
			company: companyDto.pick({
				id: true,
				name: true,
				contact: true,
			}),
			categories: z.array(
				categoryDto.pick({
					id: true,
					name: true,
				}),
			),
		}),
	),
});

export class ServiceRecommendationsResponse extends createZodDto(
	serviceRecommendationsResponseSchema,
) {}
