import { Prisma, Breed as PrismaBreed } from "@prisma/client";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { Breed } from "src/modules/breed/domain/entities/breed.entity";

export class PrismaBreedMapper {
	static toDomain(prismaBreed: PrismaBreed): Breed {
		return Breed.create(
			{
				animalTypeId: new UniqueEntityID(prismaBreed.animalTypeId),
				name: prismaBreed.name,
			},
			new UniqueEntityID(prismaBreed.id),
		);
	}

	static toPrisma(breed: Breed): Prisma.BreedUncheckedCreateInput {
		return {
			id: breed.id.toString(),
			animalTypeId: breed.animalTypeId.toString(),
			name: breed.name,
		};
	}
}
