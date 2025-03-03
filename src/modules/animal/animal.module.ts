import { Module } from "@nestjs/common";
import { IAnimalRepository } from "./domain/repositories/animal.repository";
import { AnimalPrismaRepository } from "./infrastructure/animal-prisma.repository";
import { AnimalController } from "./presentation/controllers/animal.controller";
import { CreateAnimalUseCase } from "./application/use-cases/create-animal.use-case";
import { UpdateAnimalUseCase } from "./application/use-cases/update-animal.use-case";
import { ListAnimalsFromUserUserUseCase } from "./application/use-cases/list-animals-from-user.use-case";


@Module({
	controllers: [AnimalController],
	providers: [
		CreateAnimalUseCase,
        UpdateAnimalUseCase,
        ListAnimalsFromUserUserUseCase,
		{
			provide: IAnimalRepository,
			useClass: AnimalPrismaRepository,
		},
	],
})
export class AnimalModule {}
