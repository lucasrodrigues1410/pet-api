import { createZodCustomDto } from "@/core/infra/http/dtos/zod-custom-dto";
import { z } from "zod";

const listAvailableDatesRequest = z.object({
	companyId: z.string(),
	serviceId: z.string(),
	date: z.coerce.date(),
});

const listAvailableDatesResponse = z.object({
	slots: z.array(
		z.object({
			label: z.string(),
		}),
	),
});


export class ListAvailableDatesRequestDto extends createZodCustomDto(
	listAvailableDatesRequest,
) {}


export class ListAvailableDatesResponseDto extends createZodCustomDto(
	listAvailableDatesResponse,
) {}
