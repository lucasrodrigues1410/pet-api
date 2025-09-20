import { NotificationEvent } from "../events/notification.event";

export abstract class NotificationPublisher {
	abstract dispatch(event: NotificationEvent): Promise<void>;
}
