export type NotificationChannelType = "email" | "sms" | "push" | "webhook";

export interface NotificationMetadata {
	priority?: "low" | "normal" | "high";
	retryCount?: number;
	maxRetries?: number;
	scheduledFor?: Date;
	tags?: string[];
}

export class NotificationEvent {
	constructor(
		public readonly provider: NotificationChannelType,
		public readonly templateKey: string,
		public readonly target: string,
		public readonly variables: Record<string, any>,
		public readonly metadata: NotificationMetadata = {},
	) {}
}
