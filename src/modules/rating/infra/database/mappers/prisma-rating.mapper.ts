import { Prisma, Rating as PrismaRating } from "prisma/generated/client";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { Rating } from "@/modules/rating/domain/entities/rating.entity";

export class PrismaRatingMapper {
	static toDomain(prismaRating: PrismaRating): Rating {
		return Rating.create(
			{
				companyId: new UniqueEntityID(prismaRating.companyId),
				userId: new UniqueEntityID(prismaRating.userId),
				rating: prismaRating.rating,
				comment: prismaRating.comment || undefined,
				createdAt: prismaRating.createdAt,
			},
			new UniqueEntityID(prismaRating.id),
		);
	}

	static toPrisma(rating: Rating): Prisma.RatingUncheckedCreateInput {
		return {
			id: rating.id.toString(),
			companyId: rating.companyId.toString(),
			userId: rating.userId.toString(),
			rating: rating.rating,
			comment: rating.comment || undefined,
			createdAt: rating.createdAt,
		};
	}
}
