import type { DateRange } from "@/shared/types/date-range";
import { Appointment } from "../entities/appointment.entity";

export abstract class AppointmentRepository {
	abstract create(appointment: Appointment): Promise<void>;
	abstract getByPeriod(params: {
		serviceId: string;
		range: DateRange
	}): Promise<Appointment[]>;
}
