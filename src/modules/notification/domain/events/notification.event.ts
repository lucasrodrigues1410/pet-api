export abstract class NotificationEvent {
	abstract to: string;
	abstract email?: string;
	abstract name: string;
	abstract payload: Record<string, any>;
}
