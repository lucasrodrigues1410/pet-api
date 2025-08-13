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
					host: envService.get("REDIS_HOST"),
					port: envService.get("REDIS_PORT"),
					password: envService.get("REDIS_PASSWORD"),
					maxRetriesPerRequest: 3,
					retryDelayOnFailover: 1000,
					lazyConnect: true,
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
	],
})
export class BullEventDispatcherModule {}
