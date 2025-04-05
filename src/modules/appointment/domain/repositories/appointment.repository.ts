import { Appointment } from "../entities/appointment.entity";

export abstract class AppointmentRepository {
	abstract create(appointment: Appointment): Promise<void>;
	abstract getByPeriod(params: {
		serviceId: string;
		startDate: Date;
		endDate: Date;
	}): Promise<Appointment[]>;
}
