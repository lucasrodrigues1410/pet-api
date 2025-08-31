import { Logger } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { Notification } from "@/modules/notification/domain/entities/notification.entity";
import { NotificationRepository } from "@/modules/notification/domain/interfaces/notification.repository.interface";
import { UserCreatedEvent } from "../../domain/events/user-created.event";

export class SendUserCreatedNotificationCommand {
	constructor(
		public readonly userId: string,
		public readonly email: string,
		public readonly name: string,
	) {}
}

@CommandHandler(SendUserCreatedNotificationCommand)
export class SendUserCreatedNotification
	implements ICommandHandler<SendUserCreatedNotificationCommand>
{
	private readonly logger = new Logger(SendUserCreatedNotification.name);

	constructor(
		private readonly eventBus: EventBus,
		private readonly notificationRepo: NotificationRepository,
	) {}

	async execute(command: SendUserCreatedNotificationCommand): Promise<void> {
		this.logger.log(
			`Creating welcome notification for user: ${command.userId}`,
		);

		try {
			const notification = Notification.create({
				userId: new UniqueEntityID(command.userId),
				type: "user_created",
				message: `Seja bem-vindo(a) ${command.name}!`,
				read: false,
			});

			await this.notificationRepo.create(notification);

			this.logger.log(
				`Welcome notification created for user: ${command.userId}`,
			);

			this.eventBus.publish(
				new UserCreatedEvent(command.userId, command.email, command.name),
			);

			this.logger.log(`UserCreatedEvent published for user: ${command.userId}`);
		} catch (error) {
			this.logger.error(
				`Failed to create welcome notification for user: ${command.userId}`,
				error instanceof Error ? error.stack : String(error),
			);
			throw error;
		}
	}
}
