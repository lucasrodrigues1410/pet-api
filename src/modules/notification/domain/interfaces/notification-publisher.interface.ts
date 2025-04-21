import { NotificationSenderParams } from "./notification-sender.interface";

export abstract class NotificationPublisher {
	abstract dispatch(
		userId: string,
		payload: NotificationSenderParams,
	): Promise<void>;
}
