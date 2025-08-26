import { Module } from "@nestjs/common";
import { DeactivateServiceUseCase } from "./application/use-cases/deactivate-service.use-case";
import { GetServiceByIdUseCase } from "./application/use-cases/get-service-by-id.use-case";
import { ListServicesByCompanyUseCase } from "./application/use-cases/list-services-by-company.use-case";
import { SearchServicesUseCase } from "./application/use-cases/search-services.use-case";
import { ServiceRepository } from "./domain/repositories/service.repository";
import { PrismaServiceRepository } from "./infra/database/repositories/primsa-service.repository";
import { ServiceController } from "./infra/http/controllers/service.controller";

@Module({
	controllers: [ServiceController],
	providers: [
		ListServicesByCompanyUseCase,
		GetServiceByIdUseCase,
		DeactivateServiceUseCase,
		SearchServicesUseCase,
		{
			provide: ServiceRepository,
			useClass: PrismaServiceRepository,
		},
	],
	exports: [
		{
			provide: ServiceRepository,
			useClass: PrismaServiceRepository,
		},
	],
})
export class ServiceModule {}
