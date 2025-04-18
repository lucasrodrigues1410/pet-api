import { PaginatedDto } from "@/core/infra/dtos/pagination.dto";
import { createZodDto } from "@anatine/zod-nestjs";
import { AppointmentDetailsDto } from "./appointment-details.dto";
import { AppointmentDto } from "./appointment.dto";

export class AppointmentResponse extends createZodDto(AppointmentDto) {}
export class AppointmentDetailsPaginatedResponse extends createZodDto(
	PaginatedDto(AppointmentDetailsDto),
) {}
