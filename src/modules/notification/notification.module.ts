import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";
import { EmailModule } from "../email/email.module";
import { SendUserCreatedNotification } from "./application/commands/user-created/send-user-created.handler";
import { SendUserCreatedEmailHandler } from "./application/events/user-created.event";
import { ProcessNotificationUseCase } from "./application/use-cases/process-notification.use-case";
import { NotificationRepository } from "./domain/interfaces/notification.repository.interface";
import { NotificationPublisher } from "./domain/interfaces/notification-publisher.interface";
import { PrismaNotificationRepository } from "./infra/database/repositories/prisma-notification.repository";
import { BullNotificationDispatcher } from "./infra/queue/event-dispatcher.service";
import { BullNotificationProcessor } from "./infra/queue/event-processor.service";

@Module({
	imports: [BullModule.registerQueue({ name: "notifications" }), EmailModule],
	providers: [
		{
			provide: NotificationRepository,
			useClass: PrismaNotificationRepository,
		},
		SendUserCreatedNotification,
		SendUserCreatedEmailHandler,
		ProcessNotificationUseCase,
		{ provide: NotificationPublisher, useClass: BullNotificationDispatcher },
		BullNotificationProcessor,
	],
})
export class NotificationModule {}
