import { z } from "zod";
import {
	appointmentStatus,
	coatType,
} from "@/modules/appointment/domain/entities/appointment.entity";

export const appointmentDto = z.object({
	id: z.string(),
	animalId: z.string(),
	staffId: z.string(),
	clientId: z.string(),
	serviceId: z.string(),
	companyId: z.string(),
	startDate: z.iso.datetime(),
	endDate: z.iso.datetime(),
	price: z.number(),
	coatType: z.enum(coatType),
	status: z.enum(appointmentStatus),
});
