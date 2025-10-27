import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { paymentStatus } from "@/modules/payment/domain/entities/payment.entity";
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
			avatarUrl: z.string().nullish(),
		}),
		service: z.object({ id: z.string(), name: z.string() }),
		company: z.object({
			id: z.string(),
			name: z.string(),
			logo: z.object({ id: z.string(), url: z.string() }).optional(),
		}),
		payment: z.object({
			amount: z.number().nullish(),
			status: z.enum(paymentStatus).nullish(),
			checkoutUrl: z.string().nullish(),
		}),
	});

export class AppointmentByIdResponseDto extends createZodDto(responseDto) {}
