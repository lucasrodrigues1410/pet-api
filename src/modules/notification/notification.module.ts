import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Novu } from "@novu/api";
import { EnvService } from "@/core/infra/env/env.service";
import { NotificationPublisher } from "./domain/interfaces/notification-publisher.interface";
import { BullNotificationDispatcher } from "./infra/queue/notification-dispatcher.service";
import { BullNotificationProcessor } from "./infra/queue/notification-processor.service";

@Module({
	imports: [BullModule.registerQueue({ name: "notifications" })],
	providers: [
		BullNotificationDispatcher,
		{ provide: NotificationPublisher, useClass: BullNotificationDispatcher },
		{
			provide: BullNotificationProcessor,
			useFactory: (config: EnvService) => {
				const apiKey = config.get("NOVU_SECRET_KEY");
				const novuInstance = new Novu({ secretKey: apiKey });
				return new BullNotificationProcessor(novuInstance);
			},
			inject: [ConfigService],
		},
	],
	exports: [NotificationPublisher],
})
export class NotificationModule {}
