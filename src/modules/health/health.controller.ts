import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import {
	HealthCheckService,
	MemoryHealthIndicator,
	PrismaHealthIndicator,
} from "@nestjs/terminus";
import { PrismaService } from "../../core/infra/prisma/prisma.service";
import { Public } from "../auth/infra/http/decorators/public.decorator";

@ApiTags("Health")
@Controller("health")
@Public()
export class HealthController {
	constructor(
		private health: HealthCheckService,
		private memory: MemoryHealthIndicator,
		private prisma: PrismaHealthIndicator,
		private prismaService: PrismaService,
	) {}

	@Get()
	@ApiOperation({ summary: "Verificação geral de saúde da API" })
	check() {
		return this.health.check([
			() => this.prisma.pingCheck("database", this.prismaService),
			() => this.memory.checkHeap("memory_heap", 150 * 1024 * 1024),
			() => this.memory.checkRSS("memory_rss", 300 * 1024 * 1024),
		]);
	}
}
