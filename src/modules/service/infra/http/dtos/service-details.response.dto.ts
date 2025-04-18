import { createZodDto } from "@anatine/zod-nestjs";
import { serviceDetatilsDto } from "./service-details.dto";
import { z } from "zod";

export class ServiceDetailsResponse extends createZodDto(serviceDetatilsDto) {}
export class ServiceDetailsListResponse extends createZodDto(
	z.object({
		items: z.array(serviceDetatilsDto),
	}),
) {}
