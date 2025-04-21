import { NotificationChannel } from "../enums/notification-channel.enum";
import { NotificationSender } from "./notification-sender.interface";

export abstract class INotificationSenderFactory {
	abstract getSender(channel: NotificationChannel): NotificationSender;
}
