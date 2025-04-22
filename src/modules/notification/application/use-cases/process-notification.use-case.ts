import { Injectable } from "@nestjs/common";
import { NotificationChannel } from "../../domain/enums/notification-channel.enum";
import { SendEmailUseCase } from "@/modules/email/application/use-cases/send-email.use-case";

interface Payload {
	provider: NotificationChannel;
	templateKey: string;
	target: string;
	variables: Record<string, any>;
}

@Injectable()
export class ProcessNotificationUseCase {
	constructor(private readonly sendEmailUseCase: SendEmailUseCase) {}

	async execute(payload: Payload) {
		if (payload.provider === NotificationChannel.EMAIL) {
			await this.sendEmailUseCase.execute(
				payload.templateKey,
				payload.target,
				payload.variables,
			);
		}
	}
}
