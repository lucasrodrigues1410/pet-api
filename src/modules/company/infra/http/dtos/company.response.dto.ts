import { PaginatedDto } from "@/shared/utils/pagination";
import { createZodDto } from "@anatine/zod-nestjs";
import { companyDto } from "./company.dto";

export class CompanyResponse extends createZodDto(companyDto) {}
export class CompanyPaginatedResponse extends createZodDto(
	PaginatedDto(companyDto),
) {}
