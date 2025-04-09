import { Module } from "@nestjs/common";
import { AssetModule } from "../asset/asset.module";
import { CreateAnimalUseCase } from "./application/use-cases/create-animal.use-case";
import { DeleteAnimalUseCase } from "./application/use-cases/delete-animal.use-case";
import { ListAnimalsFromUserUserUseCase } from "./application/use-cases/list-animals-from-user.use-case";
import { UpdateAnimalUseCase } from "./application/use-cases/update-animal.use-case";
import { AnimalRepository } from "./domain/repositories/animal.repository";
import { AnimalPrismaRepository } from "./infra/database/repositories/prisma-animal.repository";
import { AnimalController } from "./infra/http/controllers/animal.controller";

@Module({
	imports: [AssetModule],
	controllers: [AnimalController],
	providers: [
		CreateAnimalUseCase,
		ListAnimalsFromUserUserUseCase,
		UpdateAnimalUseCase,
		DeleteAnimalUseCase,
		{
			provide: AnimalRepository,
			useClass: AnimalPrismaRepository,
		},
	],
	exports: [
		{
			provide: AnimalRepository,
			useClass: AnimalPrismaRepository,
		},
	],
})
export class AnimalModule {}
