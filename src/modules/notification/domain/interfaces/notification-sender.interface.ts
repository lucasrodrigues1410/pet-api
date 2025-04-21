import { NotificationChannel } from "../enums/notification-channel.enum";

export type SenderEmail = {
	channel: NotificationChannel.EMAIL;
	data: {
		to: string;
		templateName: "WELCOME_USER";
		variables: Record<string, any>;
		subject: string;
	};
};
export type NotificationSenderParams = SenderEmail;

export abstract class NotificationSender {
	abstract send(params: NotificationSenderParams): Promise<void>;
}
