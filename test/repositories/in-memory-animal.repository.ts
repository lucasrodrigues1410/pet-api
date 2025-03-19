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
	getAllByUser(userId: string): Promise<Animal[]> {
		return new Promise((resolve) => {
			const animals = this.items.filter(
				(animal) => animal.userId.toString() === userId,
			);
			resolve(animals);
		});
	}
}
