import { NotificationChannel } from "../enums/notification-channel.enum";

export type EmailTemplates = {
	WELCOME_USER: { userName: string; activationLink?: string };
};

export type TemplateMap = {
	[NotificationChannel.EMAIL]: EmailTemplates;
};

export type TemplateVariables<T extends NotificationChannel> =
	T extends NotificationChannel.EMAIL
		? EmailTemplates[keyof EmailTemplates]
		: never;
