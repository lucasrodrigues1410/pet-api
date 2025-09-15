import { z } from "zod";
import { staffRole } from "@/modules/staff/domain/entities/staff.entity";

export const staffDto = z.object({
	id: z.string(),
	userId: z.string(),
	companyId: z.string(),
	role: z.enum(staffRole),
	createdAt: z.iso.datetime(),
	updatedAt: z.iso.datetime().nullish(),
	deletedAt: z.iso.datetime().nullish(),
});
