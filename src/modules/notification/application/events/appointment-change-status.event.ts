import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { EmailDispatchEvent } from "@/modules/email/domain/events/email-dispatcher.event";
import { NotificationPublisher } from "@/modules/notification/domain/interfaces/notification-publisher.interface";
import { AppointmentChangeStatusEvent } from "../../domain/events/appointment-change-status.event";

@EventsHandler(AppointmentChangeStatusEvent)
export class SendClientAppointmentChangeStatusEmailHandler
	implements IEventHandler<AppointmentChangeStatusEvent>
{
	constructor(private readonly eventDispatcher: NotificationPublisher) {}

	async handle(event: AppointmentChangeStatusEvent): Promise<void> {
		console.log(event);
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
	}
}
