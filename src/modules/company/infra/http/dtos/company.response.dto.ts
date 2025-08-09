import { createZodDto } from "nestjs-zod";
import { PaginatedDto } from "@/shared/utils/pagination";
import { companyDto } from "./company.dto";

export class CompanyResponse extends createZodDto(companyDto) {}
export class CompanyPaginatedResponse extends createZodDto(PaginatedDto(companyDto),) {}
