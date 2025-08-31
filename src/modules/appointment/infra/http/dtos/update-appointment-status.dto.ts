import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { appointmentStatus } from "@/modules/appointment/domain/entities/appointment.entity";

const updateAppointmentStatusSchema = z.object({
	status: z.enum(appointmentStatus),
});

export class UpdateAppointmentStatusDto extends createZodDto(
	updateAppointmentStatusSchema,
) {}

export const updateAppointmentStatusResponseSchema = z.object({
	id: z.string(),
	status: z.enum(appointmentStatus),
	updatedAt: z.string(),
});

export class UpdateAppointmentStatusResponseDto extends createZodDto(
	updateAppointmentStatusResponseSchema,
) {}
