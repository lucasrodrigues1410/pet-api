import { Injectable } from "@nestjs/common";
import { CacheRepository } from "@/core/domain/interfaces/cache-repository.interface";
import { RedisService } from "./redis.service";

@Injectable()
export class RedisCacheRepository implements CacheRepository {
	constructor(private redis: RedisService) {}

	async set(key: string, value: string, ttl = 60 * 60 * 24): Promise<void> {
		await this.redis.set(key, value, "EX", ttl);
	}

	get(key: string): Promise<string | null> {
		return this.redis.get(key);
	}

	async delete(key: string): Promise<void> {
		await this.redis.del(key);
	}
}
