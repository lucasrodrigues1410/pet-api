import {
	Prisma,
	Animal as PrismaAnimal,
	Breed as PrismaBreed,
} from "@prisma/client";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { Animal } from "src/modules/animal/domain/entities/animal.entity";
import { Breed } from "src/modules/breed/domain/entities/breed.entity";

export class AnimalPrismaMapper {
	static toDomain(
		prismaAnimal: PrismaAnimal & { breed?: PrismaBreed },
	): Animal {
		const breed = prismaAnimal.breed
			? Breed.create(
					{
						animalTypeId: new UniqueEntityID(prismaAnimal.breed.animalTypeId),
						name: prismaAnimal.breed.name,
					},
					new UniqueEntityID(prismaAnimal.breed.id),
				)
			: undefined;

		return Animal.create(
			{
				userId: new UniqueEntityID(prismaAnimal.userId),
				breedId: new UniqueEntityID(prismaAnimal.breedId),
				name: prismaAnimal.name,
				birthdate: prismaAnimal.birthdate,
				weight: prismaAnimal.weight,
				breed,
			},
			new UniqueEntityID(prismaAnimal.id),
		);
	}

	static toPrisma(animal: Animal): Prisma.AnimalUncheckedCreateInput {
		return {
			id: animal.id.toString(),
			userId: animal.userId.toString(),
			breedId: animal.breedId.toString(),
			name: animal.name,
			birthdate: animal.birthdate,
			weight: animal.weight,
		};
	}
}
