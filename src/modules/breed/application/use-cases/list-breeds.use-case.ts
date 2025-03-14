import { Either, right } from "src/core/either";
import { Breed } from "../../domain/entities/breed.entity";
import { BreedRepository } from "../../domain/repositories/breed.repository";
import { Injectable } from "@nestjs/common";

type GetAllBreedUseCaseResponse = Either<
	null,
	{
		breeds: Breed[];
	}
>;

@Injectable()
export class ListBreedsUseCase {
	constructor(private breedRepository: BreedRepository) {}

	async execute(): Promise<GetAllBreedUseCaseResponse> {
		const breeds = await this.breedRepository.getAll();
		return right({
			breeds,
		});
	}
}
