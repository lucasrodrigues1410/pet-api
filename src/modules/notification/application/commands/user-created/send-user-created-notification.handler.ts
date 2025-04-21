import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { UserCreatedEvent } from "../../events/user-created/user-created.event";
import { SendUserCreatedNotificationCommand } from "./send-user-created-notification.command";

@CommandHandler(SendUserCreatedNotificationCommand)
export class SendUserCreatedNotification
	implements ICommandHandler<SendUserCreatedNotificationCommand>
{
	constructor(private readonly eventBus: EventBus) {}

	async execute(command: SendUserCreatedNotificationCommand): Promise<void> {
		this.eventBus.publish(
			new UserCreatedEvent(command.userId, command.email, command.name),
		);
	}
}
