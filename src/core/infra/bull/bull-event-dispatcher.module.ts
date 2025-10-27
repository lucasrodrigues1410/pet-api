import { BullModule } from "@nestjs/bullmq";
import { Global, Module } from "@nestjs/common";
import { EnvService } from "../env/env.service";

@Global()
@Module({
	imports: [
		BullModule.forRootAsync({
			inject: [EnvService],
			useFactory: (envService: EnvService) => ({
				connection: {
					url: envService.get("REDIS_URL"),
					retryDelayOnFailover: 100,
					enableReadyCheck: false,
					maxLoadingTimeout: 0,
					lazyConnect: true,
				},
				defaultJobOptions: {
					removeOnComplete: 100,
					removeOnFail: 1000,
					attempts: 3,
					backoff: { type: "exponential", delay: 1000 },
					ttl: 24 * 60 * 60 * 1000, // 24 horas
				},
			}),
		}),
	],
})
export class BullEventDispatcherModule {}
