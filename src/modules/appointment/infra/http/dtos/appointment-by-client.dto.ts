import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { makePaginatedDto } from "@/shared/utils/pagination";
import { appointmentDto } from "./appointment.dto";

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

export class AppointmentsByClientResponseDto extends createZodDto(
	makePaginatedDto(responseDto),
) {}
