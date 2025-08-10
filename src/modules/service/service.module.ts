import { Module } from "@nestjs/common";
import { CreateServiceUseCase } from "./application/use-cases/create-service.use-case";
import { DeleteServiceUseCase } from "./application/use-cases/delete-service.use-case";
import { GetServiceByIdUseCase } from "./application/use-cases/get-service-by-id.use-case";
import { ListServicesByCompanyUseCase } from "./application/use-cases/list-services-by-company.use-case";
import { UpdateServiceUseCase } from "./application/use-cases/update-service.use-case";
import { ServiceRepository } from "./domain/repositories/service.repository";
import { PrismaServiceRepository } from "./infra/database/repositories/primsa-service.repository";
import { ServiceController } from "./infra/http/controllers/service.controller";

@Module({
	controllers: [ServiceController],
	providers: [
		ListServicesByCompanyUseCase,
		GetServiceByIdUseCase,
		CreateServiceUseCase,
		UpdateServiceUseCase,
		DeleteServiceUseCase,
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
