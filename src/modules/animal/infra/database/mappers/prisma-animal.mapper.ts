import { differenceInYears, subYears } from "date-fns";
import { Prisma, Animal as PrismaAnimal } from "prisma/generated/client";
import { Animal } from "src/modules/animal/domain/entities/animal.entity";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";

export class PrismaAnimalMapper {
	static toDomain(prismaAnimal: PrismaAnimal): Animal {
		return Animal.create(
			{
				userId: new UniqueEntityID(prismaAnimal.userId),
				breedId: new UniqueEntityID(prismaAnimal.breedId),
				assetId: prismaAnimal.assetId
					? new UniqueEntityID(prismaAnimal.assetId)
					: undefined,
				name: prismaAnimal.name,
				age: prismaAnimal.birthdate
					? differenceInYears(new Date(), prismaAnimal.birthdate)
					: undefined,
				weight: prismaAnimal.weight,
			},
			new UniqueEntityID(prismaAnimal.id),
		);
	}

	static toPrisma(animal: Animal): Prisma.AnimalUncheckedCreateInput {
		return {
			id: animal.id.toString(),
			userId: animal.userId.toString(),
			breedId: animal.breedId.toString(),
			assetId: animal.assetId?.toString(),
			name: animal.name,
			birthdate: animal.age ? subYears(new Date(), animal.age) : undefined,
			weight: animal.weight,
		};
	}

	static toPrismaUpdate(
		animal: Partial<Animal>,
	): Prisma.AnimalUncheckedUpdateInput {
		return {
			id: animal.id?.toString(),
			userId: animal.userId?.toString(),
			breedId: animal.breedId?.toString(),
			assetId: animal.assetId?.toString(),
			name: animal.name,
			birthdate: animal.age ? subYears(new Date(), animal.age) : undefined,
			weight: animal.weight,
		};
	}
}
