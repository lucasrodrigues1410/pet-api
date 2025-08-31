import { createZodDto } from "nestjs-zod";
import z from "zod";
import { assetDto } from "@/modules/asset/infra/http/dtos/asset.dto";
import { companyAvailabilityDto } from "@/modules/company-availability/infra/http/dtos/company-availability.dto";
import { makePaginatedDto } from "@/shared/utils/pagination";
import { companyDto } from "./company.dto";

const companyWithAvailabilitiesAndImagesDto = companyDto.extend({
	availabilities: z.array(companyAvailabilityDto),
	images: z.array(assetDto),
});

export class CompanyWithAvailabilitiesAndImagesResponse extends createZodDto(
	companyWithAvailabilitiesAndImagesDto,
) {}
export class CompanyResponse extends createZodDto(companyDto) {}
export class CompanyPaginatedResponse extends createZodDto(
	makePaginatedDto(companyDto),
) {}
