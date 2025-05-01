import { CacheRepository } from "@/core/domain/interfaces/cache-repository.interface";
import { Breed } from "@/modules/breed/domain/entities/breed.entity";
import {
	BreedRepository,
	FindBreedsParams,
} from "@/modules/breed/domain/repositories/breed.repository";
import { Inject, Injectable } from "@nestjs/common";
import { BASE_BREED_REPOSITORY } from "../../constants/breeds.constants";

@Injectable()
export class CachingBreedRepository implements BreedRepository {
	private readonly KEY = "breeds:all";
	private readonly TTL = 60 * 60 * 24;

	constructor(
		@Inject(BASE_BREED_REPOSITORY)
		private readonly repo: BreedRepository,
		private readonly cache: CacheRepository,
	) {}

	async getAll(params: FindBreedsParams): Promise<Breed[]> {
		const key = params.query ? `${this.KEY}:q=${params.query}` : this.KEY;
		const cached = await this.cache.get(key);
		if (cached) {
			return JSON.parse(cached).map(Breed.fromPrimitives);
		}
		const result = await this.repo.getAll(params);
		await this.cache.set(
			key,
			JSON.stringify(result.map((b) => b.toPrimitives())),
			this.TTL,
		);
		return result;
	}

	async create(breed: Breed): Promise<void> {
		return this.repo.create(breed);
	}
}
