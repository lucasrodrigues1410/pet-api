import { Logger } from "@nestjs/common";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { EmailDispatchEvent } from "@/modules/email/domain/events/email-dispatcher.event";
import { NotificationPublisher } from "@/modules/notification/domain/interfaces/notification-publisher.interface";
import { UserCreatedEvent } from "../../domain/events/user-created.event";

@EventsHandler(UserCreatedEvent)
export class SendUserCreatedEmailHandler
	implements IEventHandler<UserCreatedEvent>
{
	private readonly logger = new Logger(SendUserCreatedEmailHandler.name);

	constructor(private readonly eventDispatcher: NotificationPublisher) {}

	async handle(event: UserCreatedEvent): Promise<void> {
		this.logger.log(`Handling UserCreatedEvent for user: ${event.userId}`);

		try {
			await this.eventDispatcher.dispatch(
				new EmailDispatchEvent("welcome", event.email, {
					name: event.name,
				}),
			);

			this.logger.log(`Welcome email dispatched for user: ${event.userId}`);
		} catch (error) {
			this.logger.error(
				`Failed to dispatch welcome email for user: ${event.userId}`,
				error instanceof Error ? error.stack : String(error),
			);
			throw error;
		}
	}
}
