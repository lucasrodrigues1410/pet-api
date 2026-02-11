import { Module } from "@nestjs/common";
import { CacheModule } from "@/core/infra/cache/cache.module";
import { ListDiseasesUseCase } from "./application/use-cases/list-diseases.use-case";
import { DiseaseRepository } from "./domain/repositories/disease.repository";
import { PrismaDiseaseRepository } from "./infra/database/repositories/prisma-disease.repository";
import { DiseaseController } from "./infra/http/controllers/disease.controller";

@Module({
	imports: [CacheModule],
	controllers: [DiseaseController],
	providers: [
		ListDiseasesUseCase,
		{ provide: DiseaseRepository, useClass: PrismaDiseaseRepository },
	],
	exports: [{ provide: DiseaseRepository, useClass: PrismaDiseaseRepository }],
})
export class DiseaseModule {}
