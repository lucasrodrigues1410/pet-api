import { Injectable } from "@nestjs/common";
import { Either, right } from "@/shared/either";
import { Breed } from "../../domain/entities/breed.entity";
import { BreedRepository } from "../../domain/repositories/breed.repository";

type GetAllBreedUseCaseResponse = Either<
	null,
	{ items: { name: string; breeds: Breed[] }[] }
>;

@Injectable()
export class ListBreedsUseCase {
	constructor(private readonly breedRepository: BreedRepository) {}

	async execute(): Promise<GetAllBreedUseCaseResponse> {
		const all = await this.breedRepository.getAllGroupedByAnimalType();
		return right({ items: all });
	}
}
