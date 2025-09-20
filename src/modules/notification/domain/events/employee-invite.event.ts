import { NotificationEvent } from "./notification.event";

export class EmployeeInviteEvent extends NotificationEvent {
	readonly name = "employee.invite";
	constructor(
		public readonly to: string,
		public readonly payload: {
			email: string;
			name: string;
			expiresAt: Date;
			acceptInviteUrl: string;
		},
	) {
		super();
	}
}
