import { NotificationEvent } from "./notification.event";

export class CreateAppointmentEvent extends NotificationEvent {
	readonly name = "create-appointment";

	constructor(
		public readonly to: string,
		public readonly email: string,
		public readonly payload: {
			clientName: string;
			companyName: string;
			companyAddress?: string;
			date: string;
			price: number;
			professionalName?: string;
			detailsLink?: string;
		},
	) {
		super();
	}
}
