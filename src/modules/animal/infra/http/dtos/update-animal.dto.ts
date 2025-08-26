import { createZodDto } from "nestjs-zod";
import z from "zod";

const request = z.object({
	name: z.string().optional(),
	weight: z.number().optional(),
	birthdate: z.iso.date().optional(),
});

export class UpdateAnimalRequestDto extends createZodDto(request) {}
