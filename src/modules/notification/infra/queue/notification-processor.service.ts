import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Novu } from "@novu/api";
import { Job } from "bullmq";
import {
	MyJobPayloadsMap,
	NotificationJobOptions,
} from "../../domain/entities/job-payloads";
import { AppointmentChangeStatusEvent } from "../../domain/events/appointment-change-status.event";
import { EmployeeInviteEvent } from "../../domain/events/employee-invite.event";
import { WelcomeEvent } from "../../domain/events/welcome.event";

@Processor("notifications")
@Injectable()
export class BullNotificationProcessor extends WorkerHost {
	constructor(private readonly novu: Novu) {
		super();
	}

	async process(
		job: Job<
			MyJobPayloadsMap[NotificationJobOptions],
			any,
			NotificationJobOptions
		>,
	): Promise<void> {
		if (job.data instanceof WelcomeEvent) {
			await this.novu.trigger({
				workflowId: "welcome",
				to: { subscriberId: job.data.to, email: job.data.payload.email },
				payload: { name: job.data.payload.name },
			});
		}
		if (job.data instanceof EmployeeInviteEvent) {
			await this.novu.trigger({
				workflowId: "employee-invite",
				to: { subscriberId: job.data.to, email: job.data.payload.email },
				payload: { name: job.data.payload.name },
			});
		}
		if (job.data instanceof AppointmentChangeStatusEvent) {
			await this.novu.trigger({
				workflowId: "appointment-change-status",
				to: { subscriberId: job.data.to, email: job.data.payload.userEmail },
				payload: { name: job.data.payload.userName },
			});
		}
	}
}
