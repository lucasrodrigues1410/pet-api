import { createZodDto } from "@anatine/zod-nestjs";
import { PaginatedDto } from "@/shared/utils/pagination";
import { AppointmentDto } from "./appointment.dto";
import { AppointmentDetailsDto } from "./appointment-details.dto";

export class AppointmentResponse extends createZodDto(AppointmentDto) {}
export class AppointmentDetailResponse extends createZodDto(
	AppointmentDetailsDto,
) {}
export class AppointmentDetailsPaginatedResponse extends createZodDto(
	PaginatedDto(AppointmentDetailsDto),
) {}
