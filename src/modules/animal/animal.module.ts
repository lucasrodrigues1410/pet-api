import { Module } from "@nestjs/common";
import { CreateAnimalUseCase } from "./application/use-cases/create-animal.use-case";
import { ListAnimalsFromUserUserUseCase } from "./application/use-cases/list-animals-from-user.use-case";
import { AnimalRepository } from "./domain/repositories/animal.repository";
import { AnimalPrismaRepository } from "./infrastructure/database/prisma/repositories/animal.repository";
import { AnimalController } from "./presentation/controllers/animal.controller";

@Module({
	controllers: [AnimalController],
	providers: [
		CreateAnimalUseCase,
		ListAnimalsFromUserUserUseCase,
		{
			provide: AnimalRepository,
			useClass: AnimalPrismaRepository,
		},
	],
})
export class AnimalModule {}
