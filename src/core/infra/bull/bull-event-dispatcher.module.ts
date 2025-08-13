import { BullModule } from "@nestjs/bullmq";
import { Global, Module } from "@nestjs/common";
import { EventDispatcher } from "@/core/domain/interfaces/event-dispatcher.interface";
import { EnvService } from "../env/env.service";
import { BullEventDispatcherService } from "./bull-event-dispatcher.service";

@Global()
@Module({
	imports: [
		BullModule.forRootAsync({
			inject: [EnvService],
			useFactory: (envService: EnvService) => ({
				connection: {
					host: envService.get("REDIS_HOST"),
					port: envService.get("REDIS_PORT"),
					password: envService.get("REDIS_PASSWORD"),
				},
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
