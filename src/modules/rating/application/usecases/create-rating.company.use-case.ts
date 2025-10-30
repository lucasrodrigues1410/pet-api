import { Injectable } from "@nestjs/common";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { CompanyRepository } from "@/modules/company/domain/repositories/company.repository";
import { RatingRepository } from "@/modules/rating/domain/repositories/rating.repository";
import { Either, left, right } from "@/shared/either";
import { NotAllowedError } from "@/shared/errors/errors/not-allowed.error";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { Rating } from "../../domain/entities/rating.entity";

interface CreateRatingCompanyUseCaseRequest {
	companyId: string;
	userId: string;
	rating: number;
	comment?: string;
}

type CreateRatingCompanyUseCaseResponse = Either<NotAllowedError, void>;

@Injectable()
export class CreateRatingCompanyUseCase {
	constructor(
		private readonly ratingRepository: RatingRepository,
		private readonly companyRepository: CompanyRepository,
	) {}

	async execute(
		rating: CreateRatingCompanyUseCaseRequest,
	): Promise<CreateRatingCompanyUseCaseResponse> {
		const company = await this.companyRepository.findById(rating.companyId);
		if (!company) {
			return left(new ResourceNotFoundError("Company not found"));
		}

		// Additional business rules can be checked here
		// For example, check if the user has already rated this company
		const ratingEntity = Rating.create({
			companyId: new UniqueEntityID(rating.companyId),
			userId: new UniqueEntityID(rating.userId),
			rating: rating.rating,
			comment: rating.comment,
		});

		await this.ratingRepository.create(ratingEntity);
		return right(undefined);
	}
}
