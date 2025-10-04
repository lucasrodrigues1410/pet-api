import { endOfMonth, startOfMonth } from "date-fns";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { stringToDate } from "@/shared/schemas/string-to-date";

export const queryDto = z.object({
	startDate: stringToDate.optional().default(startOfMonth(new Date())),
	endDate: stringToDate.optional().default(endOfMonth(new Date())),
});

export class DashboardQueryDto extends createZodDto(queryDto) {}
