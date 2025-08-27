import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { AppointmentStatus } from "@/modules/appointment/domain/enums/appointment.enum";

const updateAppointmentStatusSchema = z.object({
	status: z.enum([
		AppointmentStatus.SCHEDULED,
		AppointmentStatus.CONFIRMED,
		AppointmentStatus.IN_PROGRESS,
		AppointmentStatus.COMPLETED,
		AppointmentStatus.NO_SHOW,
		AppointmentStatus.CANCELED,
	]),
});

export class UpdateAppointmentStatusDto extends createZodDto(updateAppointmentStatusSchema) {}

export const updateAppointmentStatusResponseSchema = z.object({
	id: z.string(),
	status: z.enum([
		AppointmentStatus.SCHEDULED,
		AppointmentStatus.CONFIRMED,
		AppointmentStatus.IN_PROGRESS,
		AppointmentStatus.COMPLETED,
		AppointmentStatus.NO_SHOW,
		AppointmentStatus.CANCELED,
	]),
	updatedAt: z.string(),
});

export class UpdateAppointmentStatusResponseDto extends createZodDto(updateAppointmentStatusResponseSchema) {}
