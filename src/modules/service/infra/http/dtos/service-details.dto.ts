import { createZodDto } from "nestjs-zod";
import z from "zod";
import { categoryDto } from "@/modules/category/infra/http/dtos/category.dto";
import { companyDto } from "@/modules/company/infra/http/dtos/company.dto";
import { serviceDto } from "./service.dto";

export const serviceDetailsDto = serviceDto.extend({
	company: companyDto,
	categories: z.array(categoryDto),
});

const listResponse = z.object({ items: z.array(serviceDetailsDto) });

export class ServiceDetailsResponse extends createZodDto(serviceDetailsDto) {}
export class ServiceDetailsListResponse extends createZodDto(listResponse) {}
