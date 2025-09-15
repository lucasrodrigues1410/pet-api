import { Module } from "@nestjs/common";
import { CacheRepository } from "@/core/domain/interfaces/cache-repository.interface";
import { RedisService } from "./redis/redis.service";
import { RedisCacheRepository } from "./redis/redis-cache-repository";

@Module({
	providers: [
		{ provide: CacheRepository, useClass: RedisCacheRepository },
		RedisService,
	],
	exports: [{ provide: CacheRepository, useClass: RedisCacheRepository }],
})
export class CacheModule {}
