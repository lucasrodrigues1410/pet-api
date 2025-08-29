export type NotificationChannelType = "email";

export class NotificationEvent {
	constructor(
		public readonly provider: NotificationChannelType,
		public readonly templateKey: string,
		public readonly target: string,
		public readonly variables: Record<string, any>,
	) {}
}
