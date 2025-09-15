import { createZodDto } from "nestjs-zod";
import { z } from "zod";
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
			asset: z.object({ id: z.string(), url: z.string() }).optional(),
			breed: z.object({ id: z.string(), name: z.string() }),
			age: z.number().nullish(),
		}),
		client: z.object({
			id: z.string(),
			name: z.string(),
			email: z.string(),
			avatar: z.object({ id: z.string(), url: z.string() }).optional(),
		}),
		service: z.object({ id: z.string(), name: z.string() }),
		company: z.object({
			id: z.string(),
			name: z.string(),
			logo: z.object({ id: z.string(), url: z.string() }).optional(),
		}),
	});

export class AppointmentByIdResponseDto extends createZodDto(responseDto) {}
