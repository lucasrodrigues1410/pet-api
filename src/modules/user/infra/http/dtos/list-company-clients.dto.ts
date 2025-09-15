import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { makePaginatedDto } from "@/shared/utils/pagination";
import { paginationQuerySchema } from "@/shared/utils/pagination-query";
import { userDto } from "./user.dto";

const listCompanyClientsQuerySchema = paginationQuerySchema.extend({
	search: z.string().optional(),
});

const clientWithAppointmentsSchema = userDto.extend({
	appointmentsCount: z.number(),
	lastAppointmentDate: z.iso.datetime().nullable(),
});

export class ListCompanyClientsResponseDto extends createZodDto(
	makePaginatedDto(clientWithAppointmentsSchema),
) {}
export class ListCompanyClientsQueryDto extends createZodDto(
	listCompanyClientsQuerySchema,
) {}
