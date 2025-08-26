import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const  serviceDto = z.object({
	id: z.string(),
	
});

const listResponse = z.object({
	items: z.array(serviceDto),
});

export class ServiceResponse extends createZodDto(serviceDto) {}
export class ServiceResponseList extends createZodDto(listResponse) {}
