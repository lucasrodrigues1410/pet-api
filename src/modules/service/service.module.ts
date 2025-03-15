import { Module } from "@nestjs/common";
import { ServiceRepository } from "./domain/repositories/service.repository";
import { ServicePrismaRepository } from "./infra/database/prisma/repositories/service.repository";
import { ServiceController } from "./infra/http/controllers/service.controller";
import { GetServiceByIdUseCase } from "./application/use-cases/get-service-by-id.use-case";
import { ListServicesByCompanyUseCase } from "./application/use-cases/list-services-by-company.use-case";
import { ListServicesUseCase } from "./application/use-cases/list-services.use-case";

@Module({
	controllers: [ServiceController],
	providers: [
		ListServicesByCompanyUseCase,
		ListServicesUseCase,
		GetServiceByIdUseCase,
		{
			provide: ServiceRepository,
			useClass: ServicePrismaRepository,
		},
	],
})
export class ServiceModule {}
