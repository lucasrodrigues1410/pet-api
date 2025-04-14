import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";

const listServicesByCompanyResponse = z.object({
	items: z.array(
		z.object({
			id: z.string(),
			name: z.string(),
			description: z.string().nullable(),
			price: z.number(),
			pricesRange: z.array(z.number()),
		}),
	),
});

export class ListServicesByCompanyResponseDto extends createZodDto(
	listServicesByCompanyResponse,
) {}
