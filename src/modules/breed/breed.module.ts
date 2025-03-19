import { Module } from "@nestjs/common";
import { ListBreedsUseCase } from "./application/use-cases/list-breeds.use-case";
import { BreedRepository } from "./domain/repositories/breed.repository";
import { PrismaBreedRepository } from "./infra/database/repositories/prisma-breed.repository";
import { BreedController } from "./infra/http/controllers/breed.controller";

@Module({
	controllers: [BreedController],
	providers: [
		ListBreedsUseCase,
		{
			provide: BreedRepository,
			useClass: PrismaBreedRepository,
		},
	],
})
export class BreedModule {}
