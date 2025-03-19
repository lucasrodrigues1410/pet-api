import { Module } from "@nestjs/common";
import { CreateAnimalUseCase } from "./application/use-cases/create-animal.use-case";
import { ListAnimalsFromUserUserUseCase } from "./application/use-cases/list-animals-from-user.use-case";
import { AnimalRepository } from "./domain/repositories/animal.repository";
import { AnimalPrismaRepository } from "./infra/database/repositories/prisma-animal.repository";
import { AnimalController } from "./infra/http/controllers/animal.controller";

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
