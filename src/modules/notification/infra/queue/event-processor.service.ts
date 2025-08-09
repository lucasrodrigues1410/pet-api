import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { ProcessNotificationUseCase } from "../../application/use-cases/process-notification.use-case";
import { NotificationEvent } from "../../domain/events/notification.event";

@Processor("notifications")
export class BullNotificationProcessor {
	constructor(
		private readonly processNotificationUseCase: ProcessNotificationUseCase,
	) {}

	@Process()
	async handle(job: Job<NotificationEvent>) {
		await this.processNotificationUseCase.execute(job.data);
	}
}
