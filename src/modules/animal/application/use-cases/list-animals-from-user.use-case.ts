import { PaginationQuery } from "@/core/infra/dtos/pagination-query.dto";
import { PaginationResult } from "@/core/infra/dtos/pagination.dto";
import { Either, right } from "@/shared/either";
import { Injectable } from "@nestjs/common";
import { Animal } from "../../domain/entities/animal.entity";
import { AnimalRepository } from "../../domain/repositories/animal.repository";

type ListAnimalsFromUserUseCaseRequest = {
	userId: string;
} & PaginationQuery;

type ListAnimalsFromUserUseCaseResponse = Either<
	null,
	PaginationResult<Animal>
>;

@Injectable()
export class ListAnimalsFromUserUserUseCase {
	constructor(private readonly animalRepository: AnimalRepository) {}

	async execute(
		params: ListAnimalsFromUserUseCaseRequest,
	): Promise<ListAnimalsFromUserUseCaseResponse> {
		const response = await this.animalRepository.fetchAllAnimalsByUser(params);
		return right(response);
	}
}
