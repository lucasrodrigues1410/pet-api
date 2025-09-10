import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { animalDto } from "@/modules/animal/infra/http/dtos/animal.dto";
import { appointmentStatus } from "@/modules/appointment/domain/entities/appointment.entity";
import { companyDto } from "@/modules/company/infra/http/dtos/company.dto";
import { serviceDto } from "@/modules/service/infra/http/dtos/service.dto";
import { makePaginatedDto } from "@/shared/utils/pagination";
import { paginationQuerySchema } from "@/shared/utils/pagination-query";
import { appointmentDto } from "./appointment.dto";

const queryDto = paginationQuerySchema.extend({
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
	.extend({ animal: animalDto, service: serviceDto, company: companyDto });

export class AppointmentsByClientQueryDto extends createZodDto(queryDto) {}
export class AppointmentsByClientResponseDto extends createZodDto(
	makePaginatedDto(responseDto),
) {}
