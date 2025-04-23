import { NotificationChannel } from "../enums/notification-channel.enum";

export class NotificationEvent {
	constructor(
		public readonly provider: NotificationChannel,
		public readonly templateKey: string,
		public readonly target: string,
		public readonly variables: Record<string, any>,
	) {}
}
