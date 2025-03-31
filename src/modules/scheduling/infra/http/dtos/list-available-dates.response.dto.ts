import { createZodCustomDto } from "@/core/infra/http/dtos/zod-custom-dto";
import { z } from "zod";

const listAvailableDatesResponse = z.object({
	date: z.date(),
	slots: z.array(
		z.object({
			label: z.string(),
		}),
	),
});

export class ListAvailableDatesResponseDto extends createZodCustomDto(
	listAvailableDatesResponse,
) {}
