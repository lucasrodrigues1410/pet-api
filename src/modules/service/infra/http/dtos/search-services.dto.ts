import { createZodDto } from "nestjs-zod";
import { z } from "zod";
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

const response = z.object({
	...serviceDto.shape,
	priceRange: z
		.object({
			min: z.number(),
			max: z.number(),
		})
		.default({ min: 0, max: 0 }),
});

export class SearchServicesRequestDto extends createZodDto(request) { }
export class SearchServicesResponseDto extends createZodDto(response) { }