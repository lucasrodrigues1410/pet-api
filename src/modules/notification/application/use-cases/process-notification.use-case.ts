import { Injectable } from "@nestjs/common";
import { INotificationSenderFactory } from "../../domain/interfaces/notification-sender-factory.interface";
import { NotificationSenderParams } from "../../domain/interfaces/notification-sender.interface";

@Injectable()
export class ProcessNotificationUseCase {
	constructor(private readonly senderFactory: INotificationSenderFactory) {}

	async execute(jobData: {
		payload: NotificationSenderParams;
	}) {
		const { payload } = jobData;
		const sender = this.senderFactory.getSender(payload.channel);
		await sender.send(payload);
	}
}
