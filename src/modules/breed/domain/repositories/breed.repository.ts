import { PaginationQuery } from "@/shared/utils/pagination-query";
import { Breed } from "../entities/breed.entity";
import { PaginationResult } from "@/shared/utils/pagination";

export abstract class BreedRepository {
	abstract getAll(
		params: {
			query?: string;
		} & PaginationQuery,
	): Promise<PaginationResult<Breed>>;
	abstract create(breed: Breed): Promise<void>;
}
