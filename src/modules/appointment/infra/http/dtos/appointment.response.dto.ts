import { createZodDto } from "@anatine/zod-nestjs";
import { AppointmentDto } from "./appointment.dto";
import { PaginatedDto } from "@/core/infra/dtos/pagination.dto";
import { AppointmentDetailsDto } from "./appointment-details.dto";

export class AppointmentResponse extends createZodDto(AppointmentDto) {}
export class AppointmentDetailsPaginatedResponse extends createZodDto(
	PaginatedDto(AppointmentDetailsDto),
) {}
