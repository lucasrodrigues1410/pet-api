import { endOfMonth, startOfMonth } from "date-fns";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const queryDto = z.object({
	startDate: z.iso
		.datetime()
		.optional()
		.default(startOfMonth(new Date()).toISOString()),
	endDate: z.iso
		.datetime()
		.optional()
		.default(endOfMonth(new Date()).toISOString()),
});

export class DashboardQueryDto extends createZodDto(queryDto) {}
