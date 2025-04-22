import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";
import { SendUserCreatedNotification } from "./application/commands/user-created/send-user-created.handler";
import { NotificationPublisher } from "./domain/interfaces/notification-publisher.interface";
import { BullNotificationDispatcher } from "./infra/queue/event-dispatcher.service";
import { BullNotificationProcessor } from "./infra/queue/event-processor.service";

import { EmailModule } from "../email/email.module";
import { ProcessNotificationUseCase } from "./application/use-cases/process-notification.use-case";
import { SendUserCreatedEmailHandler } from "./application/events/user-created.event";

@Module({
	imports: [
		BullModule.registerQueue({ name: "notifications" }),
		EmailModule
	],
	providers: [
		SendUserCreatedNotification,
		SendUserCreatedEmailHandler,
		ProcessNotificationUseCase,
		{ provide: NotificationPublisher, useClass: BullNotificationDispatcher },
		BullNotificationProcessor,
	],
})
export class NotificationModule {}
