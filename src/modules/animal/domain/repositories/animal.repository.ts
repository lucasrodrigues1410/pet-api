import { Animal } from "../entities/animal.entity";

export abstract class IAnimalRepository {
	abstract createAnimal(animal: Animal): Promise<{ id: number }>;
	abstract updateAnimal(data: {
		id: number;
		data: Partial<Omit<Animal, "id" | "userId">>;
	}): Promise<void>;
	abstract getAnimalById(animalId: number): Promise<Animal | null>;
	abstract deleteAnimal(animalId: number): Promise<void>;
	abstract getAnimalsByUser(userId: number): Promise<Animal[]>;
}
