import { createZodDto } from "nestjs-zod";
import z from "zod";
import { assetDto } from "@/modules/asset/infra/http/dtos/asset.dto";
import { companyAvailabilityDto } from "@/modules/company-availability/infra/http/dtos/company-availability.dto";
import { locationDto } from "@/modules/location/infra/http/dtos/location.dto";
import { serviceDto } from "@/modules/service/infra/http/dtos/service.dto";
import { companyDto } from "./company.dto";

const responseDto = companyDto.extend({
	images: z.array(assetDto),
	services: z.array(serviceDto),
	availabilities: z.array(companyAvailabilityDto),
	address: locationDto,
});

export class CompanyByIdResponseDto extends createZodDto(responseDto) {}
