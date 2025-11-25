import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Injectable, Logger } from "@nestjs/common";
import { Novu } from "@novu/api";
import { Job } from "bullmq";
import { AppointmentChangeStatusEvent } from "../../domain/events/appointment-change-status.event";
import { CreateAppointmentEvent } from "../../domain/events/create-appointment.event";

import { AppointmentReminderEvent } from "../../domain/events/appointment-reminder.event";

type NotificationEvent =
	| AppointmentChangeStatusEvent
	| CreateAppointmentEvent
	| AppointmentReminderEvent;

interface NotificationHandler {
	handle(event: NotificationEvent): Promise<void>;
}

@Processor("notifications")
@Injectable()
export class BullNotificationProcessor extends WorkerHost {
	private readonly logger = new Logger(BullNotificationProcessor.name);

	private readonly handlers: Record<string, NotificationHandler> = {
		"appointment-change-status": {
			handle: (event) =>
				this.handleAppointmentChangeStatus(
					event as AppointmentChangeStatusEvent,
				),
		},
		"create-appointment": {
			handle: (event) =>
				this.handleCreateAppointment(event as CreateAppointmentEvent),
		},
		"appointment-reminder": {
			handle: (event) =>
				this.handleAppointmentReminder(event as AppointmentReminderEvent),
		},
	};

	constructor(private readonly novu: Novu) {
		super();
	}

	async process(job: Job<NotificationEvent>): Promise<void> {
		this.logger.log(`Processing job ${job.id}: ${job.name}`);

		try {
			const handler = this.handlers[job.name];

			if (!handler) {
				throw new Error(`No handler found for job type: ${job.name}`);
			}

			await handler.handle(job.data);
			this.logger.log(`Job ${job.id} completed successfully`);
		} catch (error) {
			this.logger.error(
				`Error processing job ${job.id} (${job.name}): ${error instanceof Error ? error.message : String(error)}`,
				error instanceof Error ? error.stack : undefined,
			);
			throw error;
		}
	}

	private async handleAppointmentChangeStatus(
		event: AppointmentChangeStatusEvent,
	): Promise<void> {
		this.logger.log(`Triggering appointment change status for ${event.to}`);

		await this.novu.trigger({
			workflowId: "appointment-change-status",
			to: { subscriberId: event.to, email: event.email },
			payload: { name: event.payload.userName },
		});

		this.logger.log(`Appointment change status completed for ${event.to}`);
	}

	private async handleCreateAppointment(
		event: CreateAppointmentEvent,
	): Promise<void> {
		this.logger.log(`Triggering create appointment for ${event.to}`);
		await this.novu.trigger({
			workflowId: "create-appointment",
			to: { subscriberId: event.to, email: event.email },
			payload: event.payload,
		});

		this.logger.log(`Create appointment completed for ${event.to}`);
	}

	private async handleAppointmentReminder(
		event: AppointmentReminderEvent,
	): Promise<void> {
		this.logger.log(`Triggering appointment reminder for ${event.to}`);
		await this.novu.trigger({
			workflowId: "appointment-reminder",
			to: { subscriberId: event.to, email: event.email },
			payload: event.payload,
		});

		this.logger.log(`Appointment reminder completed for ${event.to}`);
	}
}
