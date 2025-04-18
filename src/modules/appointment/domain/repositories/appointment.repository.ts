import { PaginationQuery } from "@/core/infra/dtos/pagination-query.dto";
import { PaginationResult } from "@/core/infra/dtos/pagination.dto";
import type { DateRange } from "@/shared/types/date-range";
import {
	Appointment,
	type AppointmentWithDetails,
} from "../entities/appointment.entity";

export abstract class AppointmentRepository {
	abstract findById(id: string): Promise<AppointmentWithDetails | null>;
	abstract findByUserId(params: {
		userId: string;
		query: PaginationQuery;
	}): Promise<PaginationResult<Appointment>>;
	abstract create(appointment: Appointment): Promise<void>;
	abstract getByPeriod(params: {
		serviceId: string;
		range: DateRange;
	}): Promise<Appointment[]>;
}
