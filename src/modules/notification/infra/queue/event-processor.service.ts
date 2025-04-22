import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { NotificationEvent } from "../../domain/events/notification.event";
import { ProcessNotificationUseCase } from "../../application/use-cases/process-notification.use-case";

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
