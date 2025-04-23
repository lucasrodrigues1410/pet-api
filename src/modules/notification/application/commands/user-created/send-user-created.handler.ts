import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { Notification } from "@/modules/notification/domain/entities/notification.entity";
import { NotificationRepository } from "@/modules/notification/domain/interfaces/notification.repository.interface";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { UserCreatedEvent } from "../../../domain/events/user-created.event";
import { SendUserCreatedNotificationCommand } from "./send-user-created.command";

@CommandHandler(SendUserCreatedNotificationCommand)
export class SendUserCreatedNotification
	implements ICommandHandler<SendUserCreatedNotificationCommand>
{
	constructor(
		private readonly eventBus: EventBus,
		private readonly notificationRepo: NotificationRepository,
	) {}

	async execute(command: SendUserCreatedNotificationCommand): Promise<void> {
		// const notification = Notification.create({
		// 	userId: new UniqueEntityID(command.userId),
		// 	type: "welcome",
		// 	message: `Seja bem-vindo(a) ${command.name}!`,
		// 	read: false,
		// })

		// await this.notificationRepo.create(notification)
		this.eventBus.publish(
			new UserCreatedEvent(command.userId, command.email, command.name),
		);
	}
}
