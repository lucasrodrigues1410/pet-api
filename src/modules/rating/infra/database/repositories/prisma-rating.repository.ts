import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/core/infra/prisma/prisma.service";
import { Rating } from "@/modules/rating/domain/entities/rating.entity";
import { RatingRepository } from "@/modules/rating/domain/repositories/rating.repository";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";

@Injectable()
export class PrismaRatingRepository implements RatingRepository {
	constructor(private readonly prisma: PrismaService) {}

	async create(rating: Rating) {
		return this.prisma.$transaction(async (tx) => {
			// Cria o rating
			await tx.rating.create({
				data: {
					companyId: rating.companyId,
					userId: rating.userId,
					rating: rating.rating,
					comment: rating.comment,
				},
			});

			// Busca a empresa atual para recalcular a média
			const company = await tx.company.findUnique({
				where: { id: rating.companyId },
				select: {
					averageRating: true,
					ratingCount: true,
				},
			});

			if (!company) {
				throw new ResourceNotFoundError("Company not found");
			}

			// Novo total de ratings
			const newRatingCount = company.ratingCount + 1;

			// Novo average
			const newAverage =
				(company.averageRating * company.ratingCount + rating.rating) /
				newRatingCount;

			// Atualiza empresa com os novos valores
			await tx.company.update({
				where: { id: rating.companyId },
				data: {
					averageRating: newAverage,
					ratingCount: newRatingCount,
				},
			});
		});
	}
}
