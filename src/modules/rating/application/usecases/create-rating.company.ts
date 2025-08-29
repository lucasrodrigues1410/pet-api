import { Injectable } from "@nestjs/common";
import { RatingRepository } from "@/modules/rating/domain/repositories/rating.repository";
import { Either, left, right } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { Rating } from "../../domain/entities/rating.entity";

interface CreateRatingCompanyUseCaseRequest {
	companyId: string;
	userId: string;
	rating: number;
	comment?: string;
}

type CreateRatingCompanyUseCaseResponse = Either<ResourceNotFoundError, void>;

@Injectable()
export class CreateRatingCompanyUseCase {
	constructor(private readonly ratingRepository: RatingRepository) {}

	async execute(
		rating: CreateRatingCompanyUseCaseRequest,
	): Promise<CreateRatingCompanyUseCaseResponse> {
		try {
			const ratingEntity = Rating.create({
				companyId: rating.companyId,
				userId: rating.userId,
				rating: rating.rating,
				comment: rating.comment,
			});

			await this.ratingRepository.create(ratingEntity);

			return right(undefined);
		} catch (_) {
			return left(new ResourceNotFoundError("Company not found"));
		}
	}
}
