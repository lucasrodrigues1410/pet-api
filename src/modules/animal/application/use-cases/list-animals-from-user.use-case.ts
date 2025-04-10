import { Either, right } from "@/shared/either";
import { Injectable } from "@nestjs/common";
import { Animal } from "../../domain/entities/animal.entity";
import { AnimalRepository } from "../../domain/repositories/animal.repository";
import { PaginationParams } from "@/core/pagination/pagination-params";
import { PaginationResult } from "@/core/pagination/pagination-result";

type ListAnimalsFromUserUseCaseRequest = {
	userId: string;
} & PaginationParams;

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
