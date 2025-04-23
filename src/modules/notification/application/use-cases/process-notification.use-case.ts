import { SendEmailUseCase } from "@/modules/email/application/use-cases/send-email.use-case";
import { Injectable } from "@nestjs/common";
import { NotificationChannel } from "../../domain/enums/notification-channel.enum";
import { NotificationEvent } from "../../domain/events/notification.event";

type Payload = NotificationEvent;

@Injectable()
export class ProcessNotificationUseCase {
	constructor(private readonly sendEmailUseCase: SendEmailUseCase) {}
	async execute(params: Payload) {
		if (params.provider === NotificationChannel.EMAIL) {
			await this.sendEmailUseCase.execute(params);
		}
	}
}
