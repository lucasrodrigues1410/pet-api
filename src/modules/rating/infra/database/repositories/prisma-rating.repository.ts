import { Injectable } from "@nestjs/common";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { PrismaService } from "@/core/infra/prisma/prisma.service";
import { Rating } from "@/modules/rating/domain/entities/rating.entity";
import { RatingRepository } from "@/modules/rating/domain/repositories/rating.repository";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { PaginationQuery } from "@/shared/utils/pagination-query";
import { paginate } from "@/shared/utils/paginator";
import { PrismaRatingMapper } from "../mappers/prisma-rating.mapper";

@Injectable()
export class PrismaRatingRepository implements RatingRepository {
	constructor(private readonly prisma: PrismaService) {}

	async create(rating: Rating) {
		return this.prisma.$transaction(async (tx) => {
			// Cria o rating
			await tx.rating.create({ data: PrismaRatingMapper.toPrisma(rating) });

			// Busca a empresa atual para recalcular a média
			const company = await tx.company.findUnique({
				where: { id: rating.companyId.toString() },
				select: { averageRating: true, ratingCount: true },
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
				where: { id: rating.companyId.toString() },
				data: { averageRating: newAverage, ratingCount: newRatingCount },
			});
		});
	}

	async findByCompanyId(data: { companyId: string } & PaginationQuery) {
		const { items, meta } = await paginate(
			({ skip, take }) =>
				this.prisma.rating.findMany({
					where: { companyId: data.companyId },
					orderBy: { createdAt: "desc" },
					skip,
					take,
					include: { user: { select: { id: true, name: true } } },
				}),
			() => this.prisma.rating.count({ where: { companyId: data.companyId } }),
			data,
		);

		const result = items.map((rating) =>
			Object.assign(PrismaRatingMapper.toDomain(rating), {
				user: {
					id: new UniqueEntityID(rating.user.id),
					name: rating.user.name,
				},
			}),
		);

		return { items: result, meta };
	}

	async getCompanyRatingStats(companyId: string) {
		const company = await this.prisma.company.findUnique({
			where: { id: companyId },
			select: { averageRating: true, ratingCount: true },
		});

		if (!company) {
			throw new ResourceNotFoundError("Company not found");
		}

		// Busca distribuição das avaliações
		const distribution = await this.prisma.rating.groupBy({
			by: ["rating"],
			where: { companyId },
			_count: { rating: true },
			orderBy: { rating: "desc" },
		});

		// Garante que todas as notas de 1 a 5 estejam representadas
		const fullDistribution = [5, 4, 3, 2, 1].map((rating) => {
			const found = distribution.find((d) => d.rating === rating);
			return { rating, count: found ? found._count.rating : 0 };
		});

		return {
			averageRating: company.averageRating,
			totalRatings: company.ratingCount,
			distribution: fullDistribution,
		};
	}
}
