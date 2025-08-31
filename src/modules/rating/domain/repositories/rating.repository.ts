import { User } from "@/modules/user/domain/entities/user.entity";
import { PaginationResult } from "@/shared/utils/pagination";
import { PaginationQuery } from "@/shared/utils/pagination-query";
import { Rating } from "../entities/rating.entity";

export type CompanyRatingStats = {
	averageRating: number;
	totalRatings: number;
	distribution: {
		rating: number;
		count: number;
	}[];
};

export abstract class RatingRepository {
	abstract create(rating: Rating): Promise<void>;
	abstract findByCompanyId(
		params: { companyId: string } & PaginationQuery,
	): Promise<PaginationResult<Rating & { user: Pick<User, "id" | "name"> }>>;
	abstract getCompanyRatingStats(
		companyId: string,
	): Promise<CompanyRatingStats>;
}
