import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { EnvService } from "../../env/env.service";
import { RedisClient } from "bun";

@Injectable()
export class RedisService extends RedisClient implements OnModuleDestroy {
	constructor(envService: EnvService) {
		const redisUrl = `${envService.get("REDIS_HOST")}:${envService.get("REDIS_PORT")}/${envService.get("REDIS_DB")}`;
		super(redisUrl);
	}

	onModuleDestroy() {
		return this.close();
	}
}
