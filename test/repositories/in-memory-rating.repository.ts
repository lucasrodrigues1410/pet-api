import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { Rating } from "@/modules/rating/domain/entities/rating.entity";
import { CompanyRatingStats, RatingRepository } from "@/modules/rating/domain/repositories/rating.repository";
import { User } from "@/modules/user/domain/entities/user.entity";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { PaginationResult } from "@/shared/utils/pagination";
import { PaginationQuery } from "@/shared/utils/pagination-query";
import { paginate } from "@/shared/utils/paginator";

export class InMemoryRatingRepository implements RatingRepository {
    public items: Rating[] = [];
    public users: User[] = [];
    public shouldThrowNotFound = false;

    async create(rating: Rating): Promise<void> {
        if (this.shouldThrowNotFound) {
            throw new ResourceNotFoundError("Company not found");
        }

        this.items.push(rating);
        await Promise.resolve();
    }

    async findByCompanyId(
        data: { companyId: string } & PaginationQuery,
    ): Promise<PaginationResult<Rating & { user: Pick<User, "id" | "name"> }>> {
        const companyRatings = this.items
            .filter((rating) => rating.companyId.toString() === data.companyId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        return paginate(
            async ({ skip, take }) => {
                const paginatedRatings = companyRatings.slice(skip, skip + take);
                return paginatedRatings.map((rating) => {
                    const user = this.users.find(u => u.id.toString() === rating.userId.toString()) || {
                        id: new UniqueEntityID(rating.userId.toString()),
                        name: `User ${rating.userId.toString().slice(0, 8)}`,
                    } as User;

                    return Object.assign(rating, {
                        user: {
                            id: user.id,
                            name: user.name,
                        },
                    });
                });
            },
            async () => companyRatings.length,
            data,
        );
    }

    async getCompanyRatingStats(companyId: string): Promise<CompanyRatingStats> {
        const companyRatings = this.items.filter(
            (rating) => rating.companyId.toString() === companyId,
        );

        if (companyRatings.length === 0) {
            return {
                averageRating: 0,
                totalRatings: 0,
                distribution: [
                    { rating: 5, count: 0 },
                    { rating: 4, count: 0 },
                    { rating: 3, count: 0 },
                    { rating: 2, count: 0 },
                    { rating: 1, count: 0 },
                ],
            };
        }

        const totalRatings = companyRatings.length;
        const sum = companyRatings.reduce((acc, rating) => acc + rating.rating, 0);
        const averageRating = sum / totalRatings;

        const distribution = [5, 4, 3, 2, 1].map((ratingValue) => ({
            rating: ratingValue,
            count: companyRatings.filter((r) => r.rating === ratingValue).length,
        }));

        return {
            averageRating,
            totalRatings,
            distribution,
        };
    }
}


