import { Inject, Injectable } from "@nestjs/common";
import { NotificationChannel } from "../../domain/enums/notification-channel.enum";
import { INotificationSenderFactory } from "../../domain/interfaces/notification-sender-factory.interface";
import { NotificationSender } from "../../domain/interfaces/notification-sender.interface";
import { EmailAdapter } from "./email-sender.adapter";

@Injectable()
export class NotificationSenderFactory implements INotificationSenderFactory {
	constructor(
		@Inject(EmailAdapter) private readonly emailAdapter: NotificationSender,
	) {}

	getSender(channel: NotificationChannel): NotificationSender {
		switch (channel) {
			case NotificationChannel.EMAIL:
				return this.emailAdapter;
			default:
				throw new Error(`Sender not found for channel: ${channel}`);
		}
	}
}
