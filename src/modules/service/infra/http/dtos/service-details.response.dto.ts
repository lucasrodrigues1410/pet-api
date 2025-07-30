import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { serviceDetailsDto } from "./service-details.dto";

export class ServiceDetailsResponse extends createZodDto(serviceDetailsDto) {}
export class ServiceDetailsListResponse extends createZodDto(
	z.object({
		items: z.array(serviceDetailsDto),
	}),
) {}
