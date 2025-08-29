import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { makePaginatedDto } from "@/shared/utils/pagination";
import { serviceDto } from "./service.dto";

const request = z.object({
	query: z.string().optional(),
	location: z
		.object({
			latitude: z.number().min(-90).max(90),
			longitude: z.number().min(-180).max(180),
			radiusInKm: z.number().min(0.1).max(100).default(10),
		})
		.optional(),
	priceRange: z
		.object({
			min: z.number().min(0).optional(),
			max: z.number().min(0).optional(),
		})
		.optional(),
});

const response = serviceDto;

export class SearchServicesRequestDto extends createZodDto(request) {}
export class SearchServicesResponseDto extends createZodDto(
	makePaginatedDto(response),
) {}
