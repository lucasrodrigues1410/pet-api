import { PaginationParams } from "@/core/pagination/pagination-params";
import { PaginationResult } from "@/core/pagination/pagination-result";
import { paginate } from "@/core/pagination/paginator";
import { Animal } from "src/modules/animal/domain/entities/animal.entity";
import { AnimalRepository } from "src/modules/animal/domain/repositories/animal.repository";

export class InMemoryAnimalRepository implements AnimalRepository {
	public items: Animal[] = [];

	create(animal: Animal): Promise<Animal> {
		return new Promise((resolve) => {
			this.items.push(animal);
			resolve(animal);
		});
	}

	async update(animal: Animal) {
		const index = this.items.findIndex(
			(existingAnimal) => existingAnimal.id === animal.id,
		);

		if (index === -1) {
			throw new Error("Animal not found");
		}
		this.items[index] = animal;
		return animal;
	}

	getById(animalId: string): Promise<Animal | null> {
		return new Promise((resolve) => {
			const animal = this.items.find(
				(animal) => animal.id.toString() === animalId,
			);
			resolve(animal || null);
		});
	}
	delete(animalId: string): Promise<void> {
		return new Promise((resolve) => {
			this.items = this.items.filter(
				(animal) => animal.id.toString() !== animalId,
			);
			resolve();
		});
	}

	async fetchAllAnimalsByUser(
		params: { userId: string } & PaginationParams,
	): Promise<PaginationResult<Animal>> {
		return paginate(
			async () =>
				this.items.filter(
					(animal) => animal.userId.toString() === params.userId,
				),
			async () =>
				this.items.filter(
					(animal) => animal.userId.toString() === params.userId,
				).length,
			params,
		);
	}
}
