import { Injectable } from "@nestjs/common";
import { RedisService } from "./redis.service";
import { CacheRepository } from "@/core/domain/interfaces/cache-repository.interface";

@Injectable()
export class RedisCacheRepository implements CacheRepository {
	constructor(private redis: RedisService) {}

	async set(
		key: string,
		value: string,
		options:
			| {
					ttl?: number;
					[key: string]: any;
			  }
			| undefined = {},
	): Promise<void> {
		await this.redis.set(key, value, "EX", options?.ttl || 60 * 60 * 60);
	}

	get(key: string): Promise<string | null> {
		return this.redis.get(key);
	}

	async delete(key: string): Promise<void> {
		await this.redis.del(key);
	}
}
