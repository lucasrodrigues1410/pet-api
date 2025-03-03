import { Module } from "@nestjs/common";
import { AnimalRepository } from "./domain/repositories/animal.repository";
import { AnimalPrismaRepository } from "./infrastructure/database/prisma/animal-prisma.repository";
import { AnimalController } from "./interface/controllers/animal.controller";
import { CreateAnimalUseCase } from "./application/use-cases/create-animal.use-case";
import { ListAnimalsFromUserUserUseCase } from "./application/use-cases/list-animals-from-user.use-case";


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
