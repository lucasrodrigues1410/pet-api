import { paginate } from "@/shared/utils/paginator";
import { Breed } from "src/modules/breed/domain/entities/breed.entity";
import { BreedRepository } from "src/modules/breed/domain/repositories/breed.repository";

export class InMemoryBreedRepository implements BreedRepository {
	public items: Breed[] = [];

	async getAll(
		params: Parameters<BreedRepository["getAll"]>[0],
	) {
		const result = paginate(
			async () => this.items,
			async () => this.items.length,
			params,
		);
		return result;
	}

	async create(breed: Breed): Promise<void> {
		this.items.push(breed);
		await Promise.resolve();
	}
}
