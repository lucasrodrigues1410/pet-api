import z from "zod";
import { daysOfWeek } from "@/modules/company-availability/domain/entities/company-availability.entity";

export const companyAvailabilityDto = z.object({
	companyId: z.string(),
	day: z.enum(daysOfWeek),
	timeRange: z.object({ startTime: z.iso.time(), endTime: z.iso.time() }),
	launchTime: z.object({ startTime: z.iso.time(), endTime: z.iso.time() }),
});
