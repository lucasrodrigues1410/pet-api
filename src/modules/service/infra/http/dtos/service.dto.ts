import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { rulesDto } from "./rules.dto";

export const serviceDto = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().nullish(),
	price: z.number(),
	isActive: z.boolean(),
	duration: z.number(),
	companyId: z.string(),
	details: z.record(z.string(), z.unknown()).nullish(),
	rulesPrompt: z.string().nullish(),
	rules: z.array(rulesDto).nullish(),
});

const listResponse = z.object({ items: z.array(serviceDto) });

export class ServiceResponse extends createZodDto(serviceDto) {}
export class ServiceResponseList extends createZodDto(listResponse) {}
