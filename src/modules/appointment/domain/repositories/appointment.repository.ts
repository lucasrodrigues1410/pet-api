import type { DateRange } from "@/shared/types/date-range";
import { Appointment, type AppointmentWithDetails } from "../entities/appointment.entity";

export abstract class AppointmentRepository {
	abstract findById(id: string): Promise<AppointmentWithDetails | null>;
	abstract create(appointment: Appointment): Promise<void>;
	abstract getByPeriod(params: {
		serviceId: string;
		range: DateRange;
	}): Promise<Appointment[]>;
}
