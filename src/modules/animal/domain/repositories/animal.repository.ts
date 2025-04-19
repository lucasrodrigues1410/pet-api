import { PaginationQuery } from "@/core/infra/dtos/pagination-query.dto";
import { PaginationResult } from "@/core/infra/dtos/pagination.dto";
import { Animal } from "../entities/animal.entity";

export abstract class AnimalRepository {
	abstract create(animal: Animal): Promise<Animal>;
	abstract update(animal: Animal): Promise<Animal>;
	abstract findById(animalId: string): Promise<Animal | null>;
	abstract delete(animalId: string): Promise<void>;
	abstract fetchAllAnimalsByUser(
		params: { userId: string } & PaginationQuery,
	): Promise<PaginationResult<Animal>>;
}
