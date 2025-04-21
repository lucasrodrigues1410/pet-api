import { NotificationSender } from "./notification-sender.interface";

export abstract class INotificationSenderFactory {
	abstract getSender(channel: string): NotificationSender;
}
