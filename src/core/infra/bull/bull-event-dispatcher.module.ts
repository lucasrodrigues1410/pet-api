import { EventDispatcher } from "@/core/domain/interfaces/event-dispatcher.interface";
import { BullModule } from "@nestjs/bull";
import { Global, Module } from "@nestjs/common";
import { BullEventDispatcherService } from "./bull-event-dispatcher.service";

@Global()
@Module({
	imports: [
		BullModule.forRoot({
			redis: process.env.REDIS_HOST,
			defaultJobOptions: {
				removeOnComplete: 100,
				removeOnFail: 1000,
				attempts: 3,
				backoff: {
					type: "exponential",
					delay: 1000,
				},
			},
		}),
		BullModule.registerQueue({ name: "domain-events" }),
	],
	providers: [
		{
			provide: EventDispatcher,
			useClass: BullEventDispatcherService,
		},
	],
	exports: [
		{
			provide: EventDispatcher,
			useClass: BullEventDispatcherService,
		},
	],
})
export class BullEventDispatcherModule {}
