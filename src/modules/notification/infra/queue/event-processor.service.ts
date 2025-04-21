import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { ProcessNotificationUseCase } from "../../application/use-cases/process-notification.use-case";
import { NotificationSenderParams } from "../../domain/interfaces/notification-sender.interface";

@Processor("notifications")
export class BullNotificationProcessor {
	constructor(
		private readonly processNotificationUseCase: ProcessNotificationUseCase,
	) {}

	@Process()
	async handle(
		job: Job<{ userId: string; payload: NotificationSenderParams }>,
	) {
		await this.processNotificationUseCase.execute(job.data);
	}
}
