import { Injectable } from "@nestjs/common";
import {
	CompanyRatingStats,
	RatingRepository,
} from "@/modules/rating/domain/repositories/rating.repository";
import { Either, left, right } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";

interface GetCompanyRatingStatsUseCaseRequest {
	companyId: string;
}

type GetCompanyRatingStatsUseCaseResponse = Either<
	ResourceNotFoundError,
	CompanyRatingStats
>;

@Injectable()
export class GetCompanyRatingStatsUseCase {
	constructor(private readonly ratingRepository: RatingRepository) {}

	async execute({
		companyId,
	}: GetCompanyRatingStatsUseCaseRequest): Promise<GetCompanyRatingStatsUseCaseResponse> {
		try {
			const stats =
				await this.ratingRepository.getCompanyRatingStats(companyId);

			return right(stats);
		} catch (error) {
			if (error instanceof ResourceNotFoundError) {
				return left(error);
			}
			throw error;
		}
	}
}
