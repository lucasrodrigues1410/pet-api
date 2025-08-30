import { Injectable, Logger } from "@nestjs/common";
import { SendEmailUseCase } from "@/modules/email/application/use-cases/send-email.use-case";
import { NotificationEvent } from "../../domain/events/notification.event";

type Payload = NotificationEvent;

interface NotificationProvider {
	execute(params: Payload): Promise<void>;
}

@Injectable()
export class ProcessNotificationUseCase {
	private readonly logger = new Logger(ProcessNotificationUseCase.name);
	private readonly providers: Record<string, NotificationProvider>;

	constructor(private readonly sendEmailUseCase: SendEmailUseCase) {
		this.providers = {
			email: this.sendEmailUseCase,
		};
	}

	async execute(params: Payload): Promise<void> {
		this.logger.log(
			`Processing notification: ${params.templateKey} to ${params.target} via ${params.provider}`,
		);

		try {
			const provider = this.providers[params.provider];

			if (!provider) {
				throw new Error(
					`Unsupported notification provider: ${params.provider}. Available providers: ${Object.keys(this.providers).join(", ")}`,
				);
			}

			await provider.execute(params);

			this.logger.log(
				`Successfully processed notification: ${params.templateKey} to ${params.target}`,
			);
		} catch (error) {
			this.logger.error(
				`Failed to process notification: ${params.templateKey} to ${params.target}`,
				error instanceof Error ? error.stack : String(error),
			);
			throw error;
		}
	}
}
