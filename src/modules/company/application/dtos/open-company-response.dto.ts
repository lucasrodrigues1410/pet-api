import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const openCompanyResponse = z.object({
	results: z.array(
		z.object({
			id: z.number(),
			name: z.string(),
		}),
	),
});

export class OpenCompanyResponseDto extends createZodDto(openCompanyResponse) {}
