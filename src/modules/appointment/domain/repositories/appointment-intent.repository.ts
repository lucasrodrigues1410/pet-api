import { AppointmentIntent } from "../entities/appointment-intent.entity";

export abstract class AppointmentIntentRepository {
	abstract create(appointment: AppointmentIntent): Promise<void>;
	abstract findById(id: string): Promise<AppointmentIntent | null>;
	abstract findValidInRange(params: {
		serviceId: string;
		startDate: Date;
		endDate: Date;
	}): Promise<AppointmentIntent[]>;
}
