import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { assetDto } from "@/modules/asset/infra/http/dtos/asset.dto";
import { locationDto } from "@/modules/location/infra/http/dtos/location.dto";
import { makePaginatedDto } from "@/shared/utils/pagination";
import { companyDto } from "./company.dto";

const request = z.object({
	query: z.string().optional(),
	location: z
		.object({
			latitude: z.number().min(-90).max(90).meta({ example: -23.5505 }),
			longitude: z.number().min(-180).max(180).meta({ example: -46.6333 }),
			radiusInKm: z.number().min(0.1).max(100).default(10),
		})
		.optional(),
});

const response = companyDto.omit({ logo: true }).extend({
	address: locationDto,
	image: assetDto.pick({ id: true, url: true }).optional(),
});

export class SearchCompaniesRequestDto extends createZodDto(request) {}
export class SearchCompaniesResponseDto extends createZodDto(
	makePaginatedDto(response),
) {}
