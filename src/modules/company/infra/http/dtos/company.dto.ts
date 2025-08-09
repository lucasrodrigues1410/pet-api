import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const companyDto = z.object({
	id: z.string(),
	name: z.string(),
	address: z.string().optional(),
	contact: z.string().optional(),
});

export const createDto = companyDto.omit({ id: true });
export const updateDto = companyDto.omit({ id: true }).partial();

export class CreateCompanyRequestDto extends createZodDto(createDto) {}
export class UpdateCompanyRequestDto extends createZodDto(updateDto) {}
