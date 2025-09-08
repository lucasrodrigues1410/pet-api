import { Asset } from "@/modules/asset/domain/entities/asset";
import { Breed } from "@/modules/breed/domain/entities/breed.entity";
import { PaginationResult } from "@/shared/utils/pagination";
import type { PaginationQuery } from "@/shared/utils/pagination-query";
import { Animal } from "../entities/animal.entity";

export abstract class AnimalRepository {
	abstract create(animal: Animal): Promise<Animal>;
	abstract update(
		animalId: string,
		data: Partial<Omit<Animal, "id">>,
	): Promise<Animal>;
	abstract findById(animalId: string): Promise<Animal | null>;
	abstract delete(animalId: string): Promise<void>;
	abstract fetchAllAnimalsByUser(
		params: { userId: string } & PaginationQuery,
	): Promise<PaginationResult<Animal & { breed: Breed; asset?: Asset }>>;
}
