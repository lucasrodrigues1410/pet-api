import { CoatType } from "@/modules/appointment/domain/entities/appointment.entity";
import { z } from "zod";

export const AppointmentDto = z.object({
	id: z.string(),
	animalId: z.string(),
	staffId: z.string(),
	clientId: z.string(),
	serviceId: z.string(),
	companyId: z.string(),
	startDate: z.string(),
	endDate: z.string(),
	status: z.enum([
		"SCHEDULED",
		"CONFIRMED",
		"IN_PROGRESS",
		"COMPLETED",
		"CANCELED",
	]),
	price: z.number(),
	coatType: z.nativeEnum(CoatType),
});
