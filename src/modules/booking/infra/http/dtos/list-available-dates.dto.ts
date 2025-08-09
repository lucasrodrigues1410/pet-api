import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const request = z.object({
	companyId: z.string(),
	serviceId: z.string(),
	date: z.iso.datetime(),
});

const response = z.object({
	slots: z.array(
		z.object({
			label: z.string(),
		}),
	),
});

export class ListAvailableDatesRequestDto extends createZodDto(request) { }
export class ListAvailableDatesResponseDto extends createZodDto(response) { }
