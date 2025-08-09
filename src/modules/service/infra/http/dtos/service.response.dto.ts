import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { serviceDto } from "./service.dto";

const listResponse = z.object({
	items: z.array(serviceDto),
});

export class ServiceResponse extends createZodDto(serviceDto) {}
export class ServiceResponseList extends createZodDto(listResponse) {}
