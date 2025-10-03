import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import {
	AppointmentStatus,
	appointmentStatus,
} from "@/modules/appointment/domain/entities/appointment.entity";
import { makePaginatedDto } from "@/shared/utils/pagination";
import { paginationQuerySchema } from "@/shared/utils/pagination-query";
import { appointmentDto } from "./appointment.dto";

export const queryDto = paginationQuerySchema.extend({
	startDate: z.iso
		.datetime()
		.optional()
		.transform((date) => (date ? new Date(date) : undefined)),
	endDate: z.iso
		.datetime()
		.optional()
		.transform((date) => (date ? new Date(date) : undefined)),
	query: z.string().optional(),
	status: z
		.string()
		.optional()
		.transform(
			(status) => status?.split(",") as AppointmentStatus[] | undefined,
		)
		.refine((status) => {
			if (!status) return true;
			return status.every((s) => appointmentStatus.includes(s));
		}, "Status inválido"),
});

export const responseDto = appointmentDto
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
			breed: z.object({ id: z.string(), name: z.string() }),
			age: z.number().nullish(),
			weight: z.number().nullish(),
		}),
		client: z.object({
			id: z.string(),
			name: z.string(),
			avatar: z.object({ id: z.string(), url: z.string() }).optional(),
		}),
		service: z.object({ id: z.string(), name: z.string() }),
	});

export class AppointmentsByCompanyQueryDto extends createZodDto(queryDto) {}
export class AppointmentsByCompanyResponseDto extends createZodDto(
	makePaginatedDto(responseDto),
) {}
