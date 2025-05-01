import { Module } from "@nestjs/common";
import { ListBreedsUseCase } from "./application/use-cases/list-breeds.use-case";
import { BreedRepository } from "./domain/repositories/breed.repository";
import { PrismaBreedRepository } from "./infra/database/repositories/prisma-breed.repository";
import { BreedController } from "./infra/http/controllers/breed.controller";
import { CacheModule } from "@/core/infra/cache/cache.module";
import { CachingBreedRepository } from "./infra/database/repositories/caching-breed.repository";
import { BASE_BREED_REPOSITORY } from "./infra/constants/breeds.constants";

@Module({
	imports: [CacheModule],
	controllers: [BreedController],
	providers: [
		ListBreedsUseCase,
		{
			provide: BASE_BREED_REPOSITORY,
			useClass: PrismaBreedRepository,
		},
		{
			provide: BreedRepository,
			useClass: CachingBreedRepository,
		},
	],
})
export class BreedModule {}
