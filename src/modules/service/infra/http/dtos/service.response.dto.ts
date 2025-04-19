import { createZodDto } from "@anatine/zod-nestjs";
import { z } from "zod";
import { serviceDto } from "./service.dto";

export class ServiceResponse extends createZodDto(serviceDto) {}
export class ServiceResponseList extends createZodDto(
	z.object({
		items: z.array(serviceDto),
	}),
) {}
