import { Module } from "@nestjs/common";
import { ListActiveServicesUseCase } from "./application/use-cases/list-active-services.use-case";
import { ServiceRepository } from "./domain/repositories/service.repository";
import { ServicePrismaRepository } from "./infra/database/prisma/repositories/service.repository";
import { ServiceController } from "./infra/http/controllers/service.controller";

@Module({
	controllers: [ServiceController],
	providers: [
		ListActiveServicesUseCase,
		{
			provide: ServiceRepository,
			useClass: ServicePrismaRepository,
		},
	],
})
export class ServiceModule {}
