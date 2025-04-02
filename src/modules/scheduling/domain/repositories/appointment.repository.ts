import { Appointment } from "../entities/appointment.entity";

export abstract class AppointmentRepository {
	abstract create(appointment: Appointment, paymentId: string): Promise<void>;
	abstract getAppointmentsByPeriod(params: {
		serviceId: string;
		startDate: Date;
		endDate: Date;
	}): Promise<Appointment[]>;
}
