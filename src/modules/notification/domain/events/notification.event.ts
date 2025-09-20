export abstract class NotificationEvent {
	abstract to: string;
	abstract name: string;
	abstract payload: Record<string, any>;
}
