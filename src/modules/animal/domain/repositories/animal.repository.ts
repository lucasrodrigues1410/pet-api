import { PaginationParams } from "@/core/pagination/pagination-params";
import { PaginationResult } from "@/core/pagination/pagination-result";
import { Animal } from "../entities/animal.entity";

export abstract class AnimalRepository {
	abstract create(animal: Animal): Promise<Animal>;
	abstract update(animal: Animal): Promise<Animal>;
	abstract findById(animalId: string): Promise<Animal | null>;
	abstract delete(animalId: string): Promise<void>;
	abstract fetchAllAnimalsByUser(
		params: { userId: string } & PaginationParams,
	): Promise<PaginationResult<Animal>>;
}
