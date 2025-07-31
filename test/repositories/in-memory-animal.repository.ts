import { Animal } from "src/modules/animal/domain/entities/animal.entity";
import { AnimalRepository } from "src/modules/animal/domain/repositories/animal.repository";
import { PaginationResult } from "@/shared/utils/pagination";
import { PaginationQuery } from "@/shared/utils/pagination-query";
import { paginate } from "@/shared/utils/paginator";

export class InMemoryAnimalRepository implements AnimalRepository {
	public items: Animal[] = [];

	async create(animal: Animal): Promise<Animal> {
		this.items.push(animal);
		return animal;
	}

	async update(animalId: string, data: Partial<Omit<Animal, "id">>) {
		const index = this.items.findIndex(
			(existingAnimal) => existingAnimal.id.toString() === animalId,
		);

		if (index === -1) {
			throw new Error("Animal not found");
		}
		const animal = this.items[index].update(data);
		this.items[index] = animal;
		return animal;
	}

	async findById(animalId: string): Promise<Animal | null> {
		const animal = this.items.find(
			(animal) => animal.id.toString() === animalId,
		);
		return animal || null;
	}

	async delete(animalId: string): Promise<void> {
		this.items = this.items.filter(
			(animal) => animal.id.toString() !== animalId,
		);
	}

	async fetchAllAnimalsByUser(
		params: { userId: string } & PaginationQuery,
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
