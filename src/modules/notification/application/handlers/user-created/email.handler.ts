import { NotificationChannel } from "@/modules/notification/domain/enums/notification-channel.enum";
import { NotificationPublisher } from "@/modules/notification/domain/interfaces/notification-publisher.interface";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { UserCreatedEvent } from "../../../domain/events/user-created.event";

@EventsHandler(UserCreatedEvent)
export class SendUserCreatedEmailHandler
	implements IEventHandler<UserCreatedEvent>
{
	constructor(private readonly eventDispatcher: NotificationPublisher) {}

	async handle(event: UserCreatedEvent): Promise<void> {
		await this.eventDispatcher.dispatch(event.userId, {
			channel: NotificationChannel.EMAIL,
			data: {
				to: event.email,
				subject: "Welcome to our service!",
				templateName: "WELCOME_USER",
				variables: {
					userName: event.name,
					activationLink: "event.activationLink",
				},
			},
		});
	}
}
