import { Logger } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { EmailDispatchEvent } from "@/modules/email/domain/events/email-dispatcher.event";
import { NotificationPublisher } from "@/modules/notification/domain/interfaces/notification-publisher.interface";
import { AppointmentChangeStatusEvent } from "../../domain/events/appointment-change-status.event";

@EventsHandler(AppointmentChangeStatusEvent)
export class SendClientAppointmentChangeStatusEmailHandler
	implements IEventHandler<AppointmentChangeStatusEvent>
{
	private readonly logger = new Logger(
		SendClientAppointmentChangeStatusEmailHandler.name,
	);

	constructor(private readonly eventDispatcher: NotificationPublisher) {}

	async handle(event: AppointmentChangeStatusEvent): Promise<void> {
		this.logger.log(
			`Handling AppointmentChangeStatusEvent for user: ${event.userEmail}, status: ${event.status}`,
		);

		try {
			await this.eventDispatcher.dispatch(
				new EmailDispatchEvent("appointment-status-changed", event.userEmail, {
					userName: event.userName,
					petName: event.petName,
					serviceName: event.serviceName,
					status: event.status,
					appointmentDate: event.appointmentDate,
					appointmentTime: event.appointmentTime,
					providerName: event.providerName,
				}),
			);

			this.logger.log(
				`Appointment status change email dispatched for user: ${event.userEmail}`,
			);
		} catch (error) {
			this.logger.error(
				`Failed to dispatch appointment status change email for user: ${event.userEmail}`,
				error instanceof Error ? error.stack : String(error),
			);
			throw error;
		}
	}
}
