import { Module } from "@nestjs/common";
import { BreedController } from "./infra/http/controllers/breed.controller";
import { ListBreedsUseCase } from "./application/use-cases/list-breeds.use-case";
import { BreedRepository } from "./domain/repositories/breed.repository";
import { BreedPrismaRepository } from "./infra/database/prisma/repositories/breed.repository";

@Module({
	controllers: [BreedController],
	providers: [
		ListBreedsUseCase,
		{
			provide: BreedRepository,
			useClass: BreedPrismaRepository,
		},
	],
})
export class BreedModule {}
