import { Animal } from "../entities/animal.entity";

export abstract class AnimalRepository {
	abstract create(animal: Animal): Promise<Animal>;
	abstract getById(animalId: number): Promise<Animal | null>;
	abstract delete(animalId: number): Promise<void>;
	abstract getAllByUser(userId: number): Promise<Animal[]>;
}
