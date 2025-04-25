import { PaginatedDto } from "@/shared/utils/pagination";
import { createZodDto } from "@anatine/zod-nestjs";
import { AppointmentDetailsDto } from "./appointment-details.dto";
import { AppointmentDto } from "./appointment.dto";

export class AppointmentResponse extends createZodDto(AppointmentDto) {}
export class AppointmentDetailResponse extends createZodDto(
	AppointmentDetailsDto,
) {}
export class AppointmentDetailsPaginatedResponse extends createZodDto(
	PaginatedDto(AppointmentDetailsDto),
) {}
