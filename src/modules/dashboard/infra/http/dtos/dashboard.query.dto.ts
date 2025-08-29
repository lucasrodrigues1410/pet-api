import { endOfDay, startOfDay } from "date-fns";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const queryDto = z.object({
	startDate: z.iso
		.datetime()
		.optional()
		.default(startOfDay(new Date()).toISOString()),
	endDate: z.iso
		.datetime()
		.optional()
		.default(endOfDay(new Date()).toISOString()),
});

export class DashboardQueryDto extends createZodDto(queryDto) {}
