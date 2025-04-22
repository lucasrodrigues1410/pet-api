import { NotificationChannel } from "@/modules/notification/domain/enums/notification-channel.enum";
import { NotificationPublisher } from "@/modules/notification/domain/interfaces/notification-publisher.interface";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { NotificationEvent } from "../../domain/events/notification.event";
import { UserCreatedEvent } from "../../domain/events/user-created.event";

@EventsHandler(UserCreatedEvent)
export class SendUserCreatedEmailHandler
	implements IEventHandler<UserCreatedEvent>
{
	constructor(private readonly eventDispatcher: NotificationPublisher) {}

	async handle(event: UserCreatedEvent): Promise<void> {
		await this.eventDispatcher.dispatch(
			new NotificationEvent(NotificationChannel.EMAIL, "welcome", event.email, {
				userName: event.name,
			}),
		);
	}
}
