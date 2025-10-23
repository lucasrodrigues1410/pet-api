import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { RedisClient } from "bun";

@Injectable()
export class RedisService extends RedisClient implements OnModuleDestroy {
	onModuleDestroy() {
		return this.close();
	}
}
