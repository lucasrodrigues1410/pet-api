import { Appointment } from "../entities/appointment.entity";

export abstract class AppointmentRepository {
	abstract create(appointment: Appointment): Promise<void>;
	abstract getAppointmentsByPeriod(params: {
		companyId: string;
		startDate: Date;
		endDate: Date;
	}): Promise<Appointment[]>;
}
