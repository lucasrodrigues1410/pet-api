import { Injectable } from "@nestjs/common";
import { CompanyRepository } from "@/modules/company/domain/repositories/company.repository";
import { RatingRepository } from "@/modules/rating/domain/repositories/rating.repository";
import { Either, left, right } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";

type UseCaseInput = { userId: string; companyId: string };
type RatingEligibilityReason = "ALREADY_RATED" | "NO_COMPLETED_APPOINTMENT";

type UseCaseOutput = Either<
	ResourceNotFoundError,
	{ canRate: boolean; reason?: RatingEligibilityReason }
>;

@Injectable()
export class CheckRatingEligibilityUseCase {
	constructor(
		private readonly ratingRepository: RatingRepository,
		private readonly companyRepository: CompanyRepository,
	) {}

	async execute(params: UseCaseInput): Promise<UseCaseOutput> {
		const company = await this.companyRepository.findById(params.companyId);
		if (!company) {
			return left(new ResourceNotFoundError("Company not found"));
		}

		const canUserRate = await this.ratingRepository.canUserRateCompany(params);

		if (!canUserRate) {
			return right({ canRate: false, reason: "ALREADY_RATED" });
		}

		return right({ canRate: true });
	}
}
