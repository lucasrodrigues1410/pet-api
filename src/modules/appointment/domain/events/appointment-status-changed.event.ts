import { NotificationEvent } from "@/modules/notification/domain/events/notification.event";
import { AppointmentStatus } from "../entities/appointment.entity";

export interface AppointmentStatusChangedEventVariables {
	clientName: string;
	appointmentId: string;
	oldStatus: AppointmentStatus;
	newStatus: AppointmentStatus;
	appointmentDate: string;
	serviceName?: string;
	companyName?: string;
}

export class AppointmentStatusChangedEvent extends NotificationEvent {
	constructor(
		public readonly clientEmail: string,
		public readonly variables: AppointmentStatusChangedEventVariables,
	) {
		super("email", "appointment-status-changed", clientEmail, variables);
	}
}
