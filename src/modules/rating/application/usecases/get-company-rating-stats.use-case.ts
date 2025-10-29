import { Injectable } from "@nestjs/common";
import { CompanyRepository } from "@/modules/company/domain/repositories/company.repository";
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
	constructor(
		private readonly ratingRepository: RatingRepository,
		private readonly companyRepository: CompanyRepository,
	) {}

	async execute({
		companyId,
	}: GetCompanyRatingStatsUseCaseRequest): Promise<GetCompanyRatingStatsUseCaseResponse> {
		const companyExists = await this.companyRepository.findById(companyId);

		if (!companyExists) {
			return left(new ResourceNotFoundError("Company not found."));
		}
		const stats = await this.ratingRepository.getCompanyRatingStats(companyId);

		return right(stats);
	}
}
