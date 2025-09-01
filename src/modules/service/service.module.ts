import { Module } from "@nestjs/common";
import { CacheModule } from "@/core/infra/cache/cache.module";
import { CompanyModule } from "../company/company.module";
import { CreateServiceUseCase } from "./application/use-cases/create-service.use-case";
import { DeactivateServiceUseCase } from "./application/use-cases/deactivate-service.use-case";
import { GetServiceByIdUseCase } from "./application/use-cases/get-service-by-id.use-case";
import { ListServicesByCompanyUseCase } from "./application/use-cases/list-services-by-company.use-case";
import { TranslateRulesUseCase } from "./application/use-cases/translate-rules.use-case";
import { RulesTranslatorRepository } from "./domain/repositories/rules-translator.repository";
import { ServiceRepository } from "./domain/repositories/service.repository";
import { PrismaServiceRepository } from "./infra/database/repositories/primsa-service.repository";
import { ServiceController } from "./infra/http/controllers/service.controller";
import { GoogleAIRulesTranslatorRepository } from "./infra/repositories/google-ai-rules-translator.repository";

@Module({
	imports: [CompanyModule, CacheModule],
	controllers: [ServiceController],
	providers: [
		ListServicesByCompanyUseCase,
		GetServiceByIdUseCase,
		DeactivateServiceUseCase,
		TranslateRulesUseCase,
		CreateServiceUseCase,
		{
			provide: ServiceRepository,
			useClass: PrismaServiceRepository,
		},
		{
			provide: RulesTranslatorRepository,
			useClass: GoogleAIRulesTranslatorRepository,
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
