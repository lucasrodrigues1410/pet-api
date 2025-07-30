import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { EmailDispatchEvent } from "@/modules/email/domain/events/email-dispatcher.event";
import { NotificationPublisher } from "@/modules/notification/domain/interfaces/notification-publisher.interface";
import { UserCreatedEvent } from "../../domain/events/user-created.event";

@EventsHandler(UserCreatedEvent)
export class SendUserCreatedEmailHandler
	implements IEventHandler<UserCreatedEvent>
{
	constructor(private readonly eventDispatcher: NotificationPublisher) {}

	async handle(event: UserCreatedEvent): Promise<void> {
		await this.eventDispatcher.dispatch(
			new EmailDispatchEvent("welcome", event.email, {
				name: event.name,
			}),
		);
	}
}
