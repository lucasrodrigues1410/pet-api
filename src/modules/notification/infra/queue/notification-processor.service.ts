import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Injectable, Logger } from "@nestjs/common";
import { Novu } from "@novu/api";
import { Job } from "bullmq";
import { AppointmentChangeStatusEvent } from "../../domain/events/appointment-change-status.event";
import { CreateAppointmentEvent } from "../../domain/events/create-appointment.event";
import { WelcomeEvent } from "../../domain/events/welcome.event";

@Processor("notifications")
@Injectable()
export class BullNotificationProcessor extends WorkerHost {
	private readonly logger = new Logger(BullNotificationProcessor.name);
	constructor(private readonly novu: Novu) {
		super();
	}

	async process(job: Job): Promise<void> {
		this.logger.log(`Processing job ${job.id} of type ${job.name}`);
		if (job.name === "welcome") {
			const welcomeEvent = job.data as unknown as WelcomeEvent;
			this.logger.log(`Triggering welcome event for ${welcomeEvent.to}`);
			await this.novu.trigger({
				workflowId: "welcome",
				to: {
					subscriberId: welcomeEvent.to,
					email: welcomeEvent.payload.email,
				},
				payload: { name: welcomeEvent.payload.name },
			});
			this.logger.log(`Welcome event triggered for ${welcomeEvent.to}`);
		}
		if (job.name === "appointment-change-status") {
			const appointmentChangeStatusEvent =
				job.data as unknown as AppointmentChangeStatusEvent;
			this.logger.log(
				`Triggering appointment change status event for ${appointmentChangeStatusEvent.to}`,
			);
			await this.novu.trigger({
				workflowId: "appointment-change-status",
				to: {
					subscriberId: appointmentChangeStatusEvent.to,
					email: appointmentChangeStatusEvent.payload.userEmail,
				},
				payload: { name: appointmentChangeStatusEvent.payload.userName },
			});
			this.logger.log(
				`Appointment change status event triggered for ${appointmentChangeStatusEvent.to}`,
			);
		}
		if (job.name === "create-appointment") {
			const createAppointmentEvent =
				job.data as unknown as CreateAppointmentEvent;
			this.logger.log(
				`Triggering create appointment event for ${createAppointmentEvent.to}`,
			);
			await this.novu.trigger({
				workflowId: "create-appointment",
				to: {
					subscriberId: createAppointmentEvent.to,
					email: createAppointmentEvent.payload.email,
				},
				payload: createAppointmentEvent.payload,
			});
			this.logger.log(`Create appointment event triggered for ${job.data.to}`);
		}
	}
}
