import { Injectable } from "@nestjs/common";
import { Either, right } from "@/shared/either";
import { Breed } from "../../domain/entities/breed.entity";
import { BreedRepository } from "../../domain/repositories/breed.repository";

type GetAllBreedUseCaseRequest = {
	query?: string;
};

type GetAllBreedUseCaseResponse = Either<null, Breed[]>;

@Injectable()
export class ListBreedsUseCase {
	constructor(private readonly breedRepository: BreedRepository) {}

	async execute(
		params: GetAllBreedUseCaseRequest,
	): Promise<GetAllBreedUseCaseResponse> {
		const query = (params.query || "").trim().toLowerCase();
		const all = await this.breedRepository.getAll({ query });
		return right(all);
	}
}
