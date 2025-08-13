import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { ProcessNotificationUseCase } from "../../application/use-cases/process-notification.use-case";
import { NotificationEvent } from "../../domain/events/notification.event";

@Processor("notifications")
export class BullNotificationProcessor extends WorkerHost {
	constructor(
		private readonly processNotificationUseCase: ProcessNotificationUseCase,
	) {
		super();
	}

	async process(job: Job<NotificationEvent>) {
		await this.processNotificationUseCase.execute(job.data);
	}
}
