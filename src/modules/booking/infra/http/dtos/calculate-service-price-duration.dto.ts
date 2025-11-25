import { createZodDto } from "nestjs-zod";
import z from "zod";

const calculateServicePriceDurationRequestSchema = z.object({
	serviceId: z.string(),
	animalId: z.string(),
	coatType: z.enum(["short", "medium", "long"]),
	disease: z.string().optional(),
});

export class CalculateServicePriceDurationRequestDto extends createZodDto(
	calculateServicePriceDurationRequestSchema,
) {}

const calculateServicePriceDurationResponseSchema = z.object({
	price: z.number(),
	duration: z.number(),
});

export class CalculateServicePriceDurationResponseDto extends createZodDto(
	calculateServicePriceDurationResponseSchema,
) {}
