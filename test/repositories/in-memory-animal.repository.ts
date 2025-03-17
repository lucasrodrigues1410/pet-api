import { Animal } from "src/modules/animal/domain/entities/animal.entity";
import { AnimalRepository } from "src/modules/animal/domain/repositories/animal.repository";

export class InMemoryAnimalRepository implements AnimalRepository {
	public animals: Animal[] = [];

	create(animal: Animal): Promise<Animal> {
		return new Promise((resolve) => {
			this.animals.push(animal);
			resolve(animal);
		});
	}
	getById(animalId: number): Promise<Animal | null> {
		return new Promise((resolve) => {
            const animal = this.animals.find((animal) => animal.id === animalId);
            resolve(animal || null);
        });
	}
	delete(animalId: number): Promise<void> {
		return new Promise((resolve) => {
            this.animals = this.animals.filter((animal) => animal.id !== animalId);
            resolve();
        });
	}
	getAllByUser(userId: number): Promise<Animal[]> {
		return new Promise((resolve) => {
            const animals = this.animals.filter((animal) => animal.userId === userId);
            resolve(animals);
        });
	}
}
