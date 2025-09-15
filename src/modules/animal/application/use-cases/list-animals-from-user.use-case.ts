import { Injectable } from "@nestjs/common";
import { Asset } from "@/modules/asset/domain/entities/asset";
import { Breed } from "@/modules/breed/domain/entities/breed.entity";
import { Either, right } from "@/shared/either";
import { PaginationResult } from "@/shared/utils/pagination";
import type { PaginationQuery } from "@/shared/utils/pagination-query";
import { Animal } from "../../domain/entities/animal.entity";
import { AnimalRepository } from "../../domain/repositories/animal.repository";

type ListAnimalsFromUserUseCaseRequest = { userId: string } & PaginationQuery;

type ListAnimalsFromUserUseCaseResponse = Either<
	null,
	PaginationResult<Animal & { breed: Breed; asset?: Asset }>
>;

@Injectable()
export class ListAnimalsFromUserUserUseCase {
	constructor(private readonly animalRepository: AnimalRepository) {}

	async execute(
		data: ListAnimalsFromUserUseCaseRequest,
	): Promise<ListAnimalsFromUserUseCaseResponse> {
		const result = await this.animalRepository.fetchAllAnimalsByUser(data);
		return right(result);
	}
}
