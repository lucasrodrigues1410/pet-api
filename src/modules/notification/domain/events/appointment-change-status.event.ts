import { AppointmentStatus } from "@/modules/appointment/domain/entities/appointment.entity";
import { NotificationEvent } from "./notification.event";

export class AppointmentChangeStatusEvent extends NotificationEvent {
	readonly name = "appointment.change.status";
	constructor(
		public readonly to: string,
		public readonly email: string,
		public readonly payload: {
			appointmentStatus: AppointmentStatus;
			userName: string;
			petName: string;
			serviceName: string;
			updatedOn: Date;
			address?: string;
		},
	) {
		super();
	}
}
