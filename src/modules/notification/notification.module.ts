import { EnvModule } from "@/core/infra/env/env.module";
import { EnvService } from "@/core/infra/env/env.service";
import { MailerModule } from "@nestjs-modules/mailer";
import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";
import { SendUserCreatedNotification } from "./application/commands/user-created/send-user-created-notification.handler";
import { SendUserCreatedEmailHandler } from "./application/events/user-created/email.handler";
import { ProcessNotificationUseCase } from "./application/use-cases/process-notification.use-case";
import { NotificationPublisher } from "./domain/interfaces/notification-publisher.interface";
import { INotificationSenderFactory } from "./domain/interfaces/notification-sender-factory.interface";
import { BullNotificationDispatcher } from "./infra/queue/event-dispatcher.service";
import { BullNotificationProcessor } from "./infra/queue/event-processor.service";
import { EmailAdapter } from "./infra/senders/email-sender.adapter";
import { NotificationSenderFactory } from "./infra/senders/notification-sender.factory";
import { TemplateFactory } from "./infra/templates/template.factory";

@Module({
	imports: [
		BullModule.registerQueue({ name: "notifications" }),
		MailerModule.forRootAsync({
			imports: [EnvModule],
			inject: [EnvService],
			useFactory: async (envService: EnvService) => ({
				transport: {
					host: envService.get("SMTP_HOST"),
					port: envService.get("SMTP_PORT"),
					secure: true,
					auth: {
						user: envService.get("SMTP_USER"),
						pass: envService.get("SMTP_PASS"),
					},
				},
			}),
		}),
	],
	providers: [
		SendUserCreatedNotification,
		SendUserCreatedEmailHandler,
		ProcessNotificationUseCase,
		{ provide: NotificationPublisher, useClass: BullNotificationDispatcher },
		{
			provide: INotificationSenderFactory,
			useClass: NotificationSenderFactory,
		},
		EmailAdapter,
		TemplateFactory,
		BullNotificationProcessor,
	],
})
export class NotificationModule {}
