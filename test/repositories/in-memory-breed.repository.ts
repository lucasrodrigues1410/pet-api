import { Breed } from "src/modules/breed/domain/entities/breed.entity";
import { BreedRepository } from "src/modules/breed/domain/repositories/breed.repository";

export class InMemoryBreedRepository implements BreedRepository {
	public items: Breed[] = [];

	getAll(): Promise<Breed[]> {
		return Promise.resolve(this.items);
	}

	async create(breed: Breed): Promise<void> {
		this.items.push(breed);
		await Promise.resolve();
	}
}
