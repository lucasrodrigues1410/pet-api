import { Module } from "@nestjs/common";
import { GetServiceByIdUseCase } from "./application/use-cases/get-service-by-id.use-case";
import { ListServicesByCompanyUseCase } from "./application/use-cases/list-services-by-company.use-case";
import { ServiceRepository } from "./domain/repositories/service.repository";
import { PrismaServiceRepository } from "./infra/database/repositories/primsa-service.repository";
import { ServiceController } from "./infra/http/controllers/service.controller";

@Module({
	controllers: [ServiceController],
	providers: [
		ListServicesByCompanyUseCase,
		GetServiceByIdUseCase,
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
