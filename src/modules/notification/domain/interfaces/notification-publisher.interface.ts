import { NotificationEvent } from "../events/notification.event";

export abstract class NotificationPublisher {
	abstract dispatch(params: NotificationEvent): Promise<void>;
}
