import { InjectQueue } from "@nestjs/bullmq";
import { Injectable, Logger } from "@nestjs/common";
import type { Queue } from "bullmq";
import { SendEmailEvent } from "../../domain/events/send-email.event";
import { EmailPublisher } from "../../domain/interfaces/email-publisher.interface";
import { TemplateVariablesMap } from "../../domain/templates/template-variables-map";

@Injectable()
export class BullEmailDispatcher implements EmailPublisher {
	private readonly logger = new Logger(BullEmailDispatcher.name);

	constructor(@InjectQueue("emails") private readonly queue: Queue) {}

	async dispatch<K extends keyof TemplateVariablesMap>(
		event: SendEmailEvent<K>,
	): Promise<void> {
		try {
			const jobOptions = {
				priority: this.getPriorityValue(event.priority),
				delay: event.delay,
				attempts: 3,
				backoff: { type: "exponential" as const, delay: 2000 },
			};

			await this.queue.add("send-email", event, jobOptions);

			this.logger.log(
				`Email job queued successfully - Template: ${event.templateKey}, Target: ${event.target}, Priority: ${event.priority}`,
			);
		} catch (error) {
			this.logger.error(
				`Failed to queue email job - Template: ${event.templateKey}, Target: ${event.target}`,
				(error as Error).stack,
			);
			throw error;
		}
	}

	private getPriorityValue(priority: "low" | "normal" | "high"): number {
		switch (priority) {
			case "high":
				return 1;
			case "normal":
				return 5;
			case "low":
				return 10;
			default:
				return 5;
		}
	}
}
