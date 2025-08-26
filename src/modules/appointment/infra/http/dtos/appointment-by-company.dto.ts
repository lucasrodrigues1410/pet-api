import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { makePaginatedDto } from "@/shared/utils/pagination";
import { paginationQuerySchema } from "@/shared/utils/pagination-query";
import { appointmentDto } from "./appointment.dto";

const queryDto = paginationQuerySchema.extend({
	startDate: z.iso.datetime().optional(),
	endDate: z.iso.datetime().optional(),
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
			asset: z.object({
				id: z.string(),
				url: z.string(),
			}).optional(),
			breed: z.object({
				id: z.string(),
				name: z.string(),
			}),
			age: z.number().nullish(),
			weight: z.number().nullish(),
		}),
		client: z.object({
			id: z.string(),
			name: z.string(),
			avatar: z
				.object({
					id: z.string(),
					url: z.string(),
				})
				.optional(),
		}),
		service: z.object({
			id: z.string(),
			name: z.string(),
		}),
	});

export class AppointmentsByCompanyQueryDto extends createZodDto(queryDto) {}
export class AppointmentsByCompanyResponseDto extends createZodDto(
	makePaginatedDto(responseDto),
) {}
