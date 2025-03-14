import {
	Prisma,
	Breed as PrismaBreed,
} from "@prisma/client";
import { Breed } from "src/modules/breed/domain/entities/breed.entity";

export class BreedPrismaMapper {
	static toDomain(
		prismaBreed: PrismaBreed,
	): Breed {
		return Breed.create(
			{
				animalTypeId: prismaBreed.animalTypeId,
				name: prismaBreed.name,
			},
			prismaBreed.id,
		);
	}

	static toPrisma(breed: Breed): Prisma.BreedUncheckedCreateInput {
		return {
			id: breed.id,
			animalTypeId: breed.animalTypeId,
			name: breed.name,
		};
	}
}
