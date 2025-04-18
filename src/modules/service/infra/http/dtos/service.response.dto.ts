import { createZodDto } from "@anatine/zod-nestjs";
import { serviceDto } from "./service.dto";
import { z } from "zod";

export class ServiceResponse extends createZodDto(serviceDto) {}
export class ServiceResponseList extends createZodDto(
	z.object({
		items: z.array(serviceDto),
	}),
) {}
