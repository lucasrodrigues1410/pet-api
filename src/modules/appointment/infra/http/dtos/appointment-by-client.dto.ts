import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { appointmentStatus } from "@/modules/appointment/domain/entities/appointment.entity";
import { makePaginatedDto } from "@/shared/utils/pagination";
import { appointmentDto } from "./appointment.dto";

const queryDto = z.object({
	startDate: z.iso
		.date()
		.optional()
		.transform((date) => (date ? new Date(date) : undefined)),
	endDate: z.iso
		.date()
		.optional()
		.transform((date) => (date ? new Date(date) : undefined)),
	status: z.array(z.enum(appointmentStatus)).optional(),
});

const responseDto = appointmentDto
	.pick({
		id: true,
		startDate: true,
		endDate: true,
		price: true,
		coatType: true,
		status: true,
	})
	.extend({
		animal: z.object({
			id: z.string(),
			name: z.string(),
		}),
		service: z.object({
			id: z.string(),
			name: z.string(),
		}),
	});

export class AppointmentsByClientQueryDto extends createZodDto(queryDto) {}
export class AppointmentsByClientResponseDto extends createZodDto(
	makePaginatedDto(responseDto),
) {}
