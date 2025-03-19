import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const listBreedsResponse = z.object({
	results: z.array(
		z.object({
			id: z.string(),
			name: z.string(),
		}),
	),
});

export class ListBreedsResponseDto extends createZodDto(listBreedsResponse) {}
