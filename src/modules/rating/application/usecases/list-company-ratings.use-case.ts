import { Injectable } from "@nestjs/common";
import { RatingRepository } from "@/modules/rating/domain/repositories/rating.repository";
import { User } from "@/modules/user/domain/entities/user.entity";
import { Either, left, right } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { PaginationResult } from "@/shared/utils/pagination";
import { PaginationQuery } from "@/shared/utils/pagination-query";
import { Rating } from "../../domain/entities/rating.entity";

type ListCompanyRatingsUseCaseRequest = PaginationQuery & {
	companyId: string;
};

type ListCompanyRatingsUseCaseResponse = Either<
	ResourceNotFoundError,
	PaginationResult<Rating & { user: Pick<User, "id" | "name"> }>
>;

@Injectable()
export class ListCompanyRatingsUseCase {
	constructor(private readonly ratingRepository: RatingRepository) {}

	async execute({
		companyId,
		page,
		limit,
	}: ListCompanyRatingsUseCaseRequest): Promise<ListCompanyRatingsUseCaseResponse> {
		try {
			const result = await this.ratingRepository.findByCompanyId({
				companyId,
				page: page,
				limit: limit,
			});

			return right(result);
		} catch (error) {
			if (error instanceof ResourceNotFoundError) {
				return left(error);
			}
			throw error;
		}
	}
}
