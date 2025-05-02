import { CacheRepository } from "@/core/domain/interfaces/cache-repository.interface";
import { Module } from "@nestjs/common";
import { RedisCacheRepository } from "./redis/redis-cache-repository";
import { RedisService } from "./redis/redis.service";

@Module({
	providers: [
		{
			provide: CacheRepository,
			useClass: RedisCacheRepository,
		},
		RedisService,
	],
	exports: [
		{
			provide: CacheRepository,
			useClass: RedisCacheRepository,
		},
	],
})
export class CacheModule {}
