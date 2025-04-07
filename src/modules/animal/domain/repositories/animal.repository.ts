import { Animal } from "../entities/animal.entity";

export abstract class AnimalRepository {
	abstract create(animal: Animal): Promise<Animal>;
	abstract update(animal: Animal): Promise<Animal>;
	abstract getById(animalId: string): Promise<Animal | null>;
	abstract delete(animalId: string): Promise<void>;
	abstract getAllByUser(userId: string): Promise<Animal[]>;
}
