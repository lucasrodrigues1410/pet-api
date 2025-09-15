import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { assetDto } from "@/modules/asset/infra/http/dtos/asset.dto";
import { locationDto } from "@/modules/location/infra/http/dtos/location.dto";
import { makePaginatedDto } from "@/shared/utils/pagination";
import { paginationQuerySchema } from "@/shared/utils/pagination-query";
import { companyDto } from "./company.dto";

const request = paginationQuerySchema.extend({
	search: z.string().optional(),
	categories: z.array(z.string()).optional(),
	location: z.string().optional(),
});

const response = companyDto
	.omit({ logo: true })
	.extend({
		address: locationDto,
		image: assetDto.pick({ id: true, url: true }).nullish(),
	});

export class SearchCompaniesRequestDto extends createZodDto(request) {}
export class SearchCompaniesResponseDto extends createZodDto(
	makePaginatedDto(response),
) {}
