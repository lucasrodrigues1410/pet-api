import { NotificationEvent } from "./notification.event";

export class WelcomeEvent extends NotificationEvent {
	readonly name = "welcome";
	constructor(
		public readonly to: string,
		public readonly payload: { name: string; email: string },
	) {
		super();
	}
}
