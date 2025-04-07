import { Either, right } from "@/shared/either";
import { Injectable } from "@nestjs/common";
import { Breed } from "../../domain/entities/breed.entity";
import { BreedRepository } from "../../domain/repositories/breed.repository";

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
