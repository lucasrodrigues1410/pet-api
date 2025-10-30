import { Injectable } from "@nestjs/common";
import { CompanyRepository } from "@/modules/company/domain/repositories/company.repository";
import { RatingRepository } from "@/modules/rating/domain/repositories/rating.repository";
import { User } from "@/modules/user/domain/entities/user.entity";
import { Either, left, right } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { PaginationResult } from "@/shared/utils/pagination";
import { PaginationQuery } from "@/shared/utils/pagination-query";
import { Rating } from "../../domain/entities/rating.entity";

type ListCompanyRatingsUseCaseRequest = PaginationQuery & { companyId: string };

type ListCompanyRatingsUseCaseResponse = Either<
	ResourceNotFoundError,
	PaginationResult<Rating & { user: Pick<User, "id" | "name"> }>
>;

@Injectable()
export class ListCompanyRatingsUseCase {
	constructor(
		private readonly ratingRepository: RatingRepository,
		private readonly companyRepository: CompanyRepository,
	) {}

	async execute({
		companyId,
		page,
		limit,
	}: ListCompanyRatingsUseCaseRequest): Promise<ListCompanyRatingsUseCaseResponse> {
		const companyExists = await this.companyRepository.findById(companyId);

		if (!companyExists) {
			return left(new ResourceNotFoundError("Company not found"));
		}
		const result = await this.ratingRepository.findByCompanyId({
			companyId,
			page: page,
			limit: limit,
		});

		return right(result);
	}
}
