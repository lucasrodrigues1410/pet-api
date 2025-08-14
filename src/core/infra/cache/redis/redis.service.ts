import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { RedisClient } from "bun";
import { EnvService } from "../../env/env.service";

@Injectable()
export class RedisService extends RedisClient implements OnModuleDestroy {
	constructor(envService: EnvService) {
		const redisUrl = `${envService.get("REDIS_HOST")}:${envService.get("REDIS_PORT")}`;
		super(redisUrl);
	}

	onModuleDestroy() {
		return this.close();
	}
}
