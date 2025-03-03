import { Injectable, NotFoundException } from "@nestjs/common";
import { Animal } from "../../domain/entities/animal.entity";
import { IAnimalRepository } from "../../domain/repositories/animal.repository";

@Injectable()
export class UpdateAnimalUseCase {
	constructor(private readonly animalRepository: IAnimalRepository) {}

	async execute(
		animalId: number,
		userId: number,
		data: Partial<Omit<Animal, "id" | "userId">>,
	) {
		const animal = await this.animalRepository.getAnimalById(animalId);

		if (!animal || animal.userId !== userId) {
			throw new NotFoundException("Animal não encontrado");
		}

		return this.animalRepository.updateAnimal({
			id: animalId,
			data,
		});
	}
}
