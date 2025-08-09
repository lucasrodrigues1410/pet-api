import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { serviceDetailsDto } from "./service-details.dto";

const listResponse = z.object({
	items: z.array(serviceDetailsDto),
});

export class ServiceDetailsResponse extends createZodDto(serviceDetailsDto) {}
export class ServiceDetailsListResponse extends createZodDto(listResponse) {}
