import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const companyDto = z.object({
	id: z.string(),
	name: z.string(),
	address: z.string().optional(),
	contact: z.string().optional(),
});

export const createCompanyDto = z.object({
  name: z.string().min(1),
  address: z.string().optional(),
  contact: z.string().optional(),
});

export const updateCompanyDto = z.object({
  name: z.string().min(1).optional(),
  address: z.string().optional(),
  contact: z.string().optional(),
});

export class CreateCompanyRequestDto extends createZodDto(createCompanyDto) {}
export class UpdateCompanyRequestDto extends createZodDto(updateCompanyDto) {}
