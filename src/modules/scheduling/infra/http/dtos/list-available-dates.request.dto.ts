import { createZodCustomDto } from "@/core/infra/http/dtos/zod-custom-dto";
import { z } from "zod";

const listAvailableDatesRequest = z.object({
	companyId: z.string(),
	serviceId: z.string(),
	date: z.coerce.date(),
});

export class ListAvailableDatesRequestDto extends createZodCustomDto(
	listAvailableDatesRequest,
) {}
