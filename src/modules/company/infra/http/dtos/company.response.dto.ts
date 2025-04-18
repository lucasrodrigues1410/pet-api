import { createZodDto } from "@anatine/zod-nestjs";
import { companyDto } from "./company.dto";
import { PaginatedDto } from "@/core/infra/dtos/pagination.dto";

export class CompanyResponse extends createZodDto(companyDto) {}
export class CompanyPaginatedResponse extends createZodDto(
	PaginatedDto(companyDto),
) {}
