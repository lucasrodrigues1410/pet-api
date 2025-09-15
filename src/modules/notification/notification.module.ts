import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { EmailModule } from "../email/email.module";
import { SendClientAppointmentChangeStatusNotification } from "./application/commands/send-appointment-change-status.handler";
import { SendUserCreatedNotification } from "./application/commands/send-user-created.handler";
import { SendClientAppointmentChangeStatusEmailHandler } from "./application/events/appointment-change-status.event";
import { SendUserCreatedEmailHandler } from "./application/events/user-created.event";
import { GetUnreadNotificationsCountUseCase } from "./application/use-cases/get-unread-notifications-count.use-case";
import { GetUserNotificationsUseCase } from "./application/use-cases/get-user-notifications.use-case";
import { MarkAllNotificationsAsReadUseCase } from "./application/use-cases/mark-all-notifications-as-read.use-case";
import { MarkNotificationAsReadUseCase } from "./application/use-cases/mark-notification-as-read.use-case";
import { ProcessNotificationUseCase } from "./application/use-cases/process-notification.use-case";
import { NotificationRepository } from "./domain/interfaces/notification.repository.interface";
import { NotificationPublisher } from "./domain/interfaces/notification-publisher.interface";
import { PrismaNotificationRepository } from "./infra/database/repositories/prisma-notification.repository";
import { BullNotificationDispatcher } from "./infra/queue/event-dispatcher.service";
import { BullNotificationProcessor } from "./infra/queue/event-processor.service";

@Module({
	imports: [BullModule.registerQueue({ name: "notifications" }), EmailModule],
	providers: [
		{ provide: NotificationRepository, useClass: PrismaNotificationRepository },
		// Command Handlers
		SendUserCreatedNotification,
		SendClientAppointmentChangeStatusNotification,

		// Event Handlers
		SendUserCreatedEmailHandler,
		SendClientAppointmentChangeStatusEmailHandler,

		// Use Cases
		ProcessNotificationUseCase,
		GetUserNotificationsUseCase,
		MarkNotificationAsReadUseCase,
		MarkAllNotificationsAsReadUseCase,
		GetUnreadNotificationsCountUseCase,

		// Infrastructure
		{ provide: NotificationPublisher, useClass: BullNotificationDispatcher },
		BullNotificationProcessor,
	],
	exports: [
		// Export use cases so they can be used by controllers
		GetUserNotificationsUseCase,
		MarkNotificationAsReadUseCase,
		MarkAllNotificationsAsReadUseCase,
		GetUnreadNotificationsCountUseCase,
		NotificationRepository,
	],
})
export class NotificationModule {}
