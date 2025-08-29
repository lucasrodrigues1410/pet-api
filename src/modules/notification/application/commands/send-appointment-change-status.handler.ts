import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { format } from "date-fns";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { AppointmentStatus } from "@/modules/appointment/domain/entities/appointment.entity";
import { Notification } from "@/modules/notification/domain/entities/notification.entity";
import { AppointmentChangeStatusEvent } from "@/modules/notification/domain/events/appointment-change-status.event";
import { NotificationRepository } from "@/modules/notification/domain/interfaces/notification.repository.interface";

export class SendClientAppointmentChangeStatusNotificationCommand {
	constructor(
		public readonly data: {
			appointmentStatus: AppointmentStatus;
			userName: string;
			userEmail: string;
			petName: string;
			serviceName: string;
			providerName: string;
			appointmentId: string;
			clientId: string;
			updatedOn: Date;
		},
	) {}
}

@CommandHandler(SendClientAppointmentChangeStatusNotificationCommand)
export class SendClientAppointmentChangeStatusNotification
	implements
		ICommandHandler<SendClientAppointmentChangeStatusNotificationCommand>
{
	constructor(
		private readonly eventBus: EventBus,
		private readonly notificationRepo: NotificationRepository,
	) {}

	async execute(
		command: SendClientAppointmentChangeStatusNotificationCommand,
	): Promise<void> {
		const notification = Notification.create({
			userId: new UniqueEntityID(command.data.clientId),
			type: "appointment_status_changed",
			message: `O agendamento ${command.data.appointmentId} foi alterado para ${command.data.appointmentStatus}`,
			read: false,
		});

		await this.notificationRepo.create(notification);
		this.eventBus.publish(
			new AppointmentChangeStatusEvent(
				command.data.userName,
				command.data.userEmail,
				command.data.petName,
				command.data.serviceName,
				command.data.appointmentStatus,
				format(command.data.updatedOn, "dd/MM/yyyy"),
				format(command.data.updatedOn, "HH:mm"),
				command.data.providerName,
			),
		);
	}
}
