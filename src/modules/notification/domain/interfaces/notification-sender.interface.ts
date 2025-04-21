import { NotificationChannel } from "../enums/notification-channel.enum";
import { ChannelConfigMap } from "../models/notification-channel.types";

export type NotificationChannelType = keyof ChannelConfigMap;
export type NotificationData<T extends NotificationChannelType> = {
	channel: T;
	data: {
		to: string;
	} & ChannelConfigMap[T];
};


export type NotificationSenderParams = NotificationData<NotificationChannel.EMAIL>;
export abstract class NotificationSender {
	abstract send(params: NotificationSenderParams): Promise<void>;
}
