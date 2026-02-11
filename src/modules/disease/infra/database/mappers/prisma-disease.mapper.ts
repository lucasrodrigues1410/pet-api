import { Prisma, Disease as PrismaDisease } from "prisma/generated/client";
import { Disease } from "src/modules/disease/domain/entities/disease.entity";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";

export class PrismaDiseaseMapper {
	static toDomain(prismaDisease: PrismaDisease): Disease {
		return Disease.create(
			{
				name: prismaDisease.name,
			},
			new UniqueEntityID(prismaDisease.id),
		);
	}

	static toPrisma(disease: Disease): Prisma.DiseaseUncheckedCreateInput {
		return {
			id: disease.id.toString(),
			name: disease.name,
		};
	}
}
