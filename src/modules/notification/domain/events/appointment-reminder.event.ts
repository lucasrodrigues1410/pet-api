import { NotificationEvent } from "./notification.event";

export class AppointmentReminderEvent extends NotificationEvent {
	readonly name = "appointment-reminder";

	constructor(
		public readonly to: string,
		public readonly email: string,
		public readonly payload: {
			clientName: string;
			companyName: string;
			date: string;
			serviceName: string;
			professionalName?: string;
		},
	) {
		super();
	}
}
