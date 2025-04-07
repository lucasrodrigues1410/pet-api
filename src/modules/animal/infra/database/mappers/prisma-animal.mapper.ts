import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { PrismaAssetMapper } from "@/modules/asset/infra/database/mappers/prisma-asset.mapper";
import { PrismaBreedMapper } from "@/modules/breed/infra/database/mappers/prisma-breed.mapper";
import {
	Prisma,
	Animal as PrismaAnimal,
	Asset as PrismaAsset,
	Breed as PrismaBreed,
} from "@prisma/client";
import { Animal } from "src/modules/animal/domain/entities/animal.entity";

export class AnimalPrismaMapper {
	static toDomain(
		prismaAnimal: PrismaAnimal & { breed?: PrismaBreed; asset?: PrismaAsset },
	): Animal {
		const breed = prismaAnimal.breed
			? PrismaBreedMapper.toDomain(prismaAnimal.breed)
			: undefined;

		const asset = prismaAnimal.asset
			? PrismaAssetMapper.toDomain(prismaAnimal.asset)
			: undefined;

		return Animal.create(
			{
				userId: new UniqueEntityID(prismaAnimal.userId),
				breedId: new UniqueEntityID(prismaAnimal.breedId),
				assetId: prismaAnimal.assetId
					? new UniqueEntityID(prismaAnimal.assetId)
					: undefined,
				name: prismaAnimal.name,
				birthdate: prismaAnimal.birthdate,
				weight: prismaAnimal.weight,
				breed,
				asset,
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
			birthdate: animal.birthdate,
			weight: animal.weight,
		};
	}
}
