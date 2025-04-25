import { Either, right } from "@/shared/either";
import { Injectable } from "@nestjs/common";
import { Breed } from "../../domain/entities/breed.entity";
import { BreedRepository } from "../../domain/repositories/breed.repository";
import { PaginationQuery } from "@/shared/utils/pagination-query";
import { PaginationResult } from "@/shared/utils/pagination";

type GetAllBreedUseCaseRequest = {
	query?: string;
} & PaginationQuery;

type GetAllBreedUseCaseResponse = Either<
	null,
	PaginationResult<Breed>
>;

@Injectable()
export class ListBreedsUseCase {
	constructor(private breedRepository: BreedRepository) {}

	async execute(
		params: GetAllBreedUseCaseRequest,
	): Promise<GetAllBreedUseCaseResponse> {
		const result = await this.breedRepository.getAll(params);
		return right(result);
	}
}
