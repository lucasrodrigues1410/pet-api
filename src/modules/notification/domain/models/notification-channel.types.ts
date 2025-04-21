import { NotificationChannel } from "../enums/notification-channel.enum";
import { EmailTemplates } from "./notification-template.types";

export type ChannelConfigMap = {
	[NotificationChannel.EMAIL]: {
		templateName: keyof EmailTemplates;
		variables: EmailTemplates[keyof EmailTemplates];
		subject: string;
	};
};