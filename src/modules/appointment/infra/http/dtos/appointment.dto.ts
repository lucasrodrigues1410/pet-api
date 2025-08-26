import { AppointmentStatus } from "prisma/generated/client";
import { z } from "zod";
import { CoatType } from "@/modules/appointment/domain/enums/appointment.enum";

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
	coatType: z.enum(CoatType),
	status: z.enum(AppointmentStatus),
});
