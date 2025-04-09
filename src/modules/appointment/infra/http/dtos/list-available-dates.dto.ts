import { createZodDto } from "@anatine/zod-nestjs";
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

export class ListAvailableDatesRequestDto extends createZodDto(
	listAvailableDatesRequest,
) {}

export class ListAvailableDatesResponseDto extends createZodDto(
	listAvailableDatesResponse,
) {}
