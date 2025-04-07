import { Either, right } from "@/shared/either";
import { Injectable } from "@nestjs/common";
import { Animal } from "../../domain/entities/animal.entity";
import { AnimalRepository } from "../../domain/repositories/animal.repository";

interface ListAnimalsFromUserUseCaseRequest {
	userId: string;
}

type ListAnimalsFromUserUseCaseResponse = Either<
	null,
	{
		animals: Animal[];
	}
>;

@Injectable()
export class ListAnimalsFromUserUserUseCase {
	constructor(private readonly animalRepository: AnimalRepository) {}

	async execute({
		userId,
	}: ListAnimalsFromUserUseCaseRequest): Promise<ListAnimalsFromUserUseCaseResponse> {
		const animals = await this.animalRepository.getAllByUser(userId);
		return right({
			animals,
		});
	}
}
