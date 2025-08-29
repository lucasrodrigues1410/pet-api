import { Injectable } from "@nestjs/common";
import { SendEmailUseCase } from "@/modules/email/application/use-cases/send-email.use-case";
import { NotificationEvent } from "../../domain/events/notification.event";

type Payload = NotificationEvent;

@Injectable()
export class ProcessNotificationUseCase {
	constructor(private readonly sendEmailUseCase: SendEmailUseCase) {}
	async execute(params: Payload) {
		if (params.provider === "email") {
			await this.sendEmailUseCase.execute(params);
		}
	}
}
