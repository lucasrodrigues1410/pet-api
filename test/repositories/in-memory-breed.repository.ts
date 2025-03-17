import { Breed } from "src/modules/breed/domain/entities/breed.entity";
import { BreedRepository } from "src/modules/breed/domain/repositories/breed.repository";

export class InMemoryBreedRepository implements BreedRepository {
	private breeds: Breed[] = [];

	getAll(): Promise<Breed[]> {
		return Promise.resolve(this.breeds);
	}

    async create(breed: Breed): Promise<void> {
        this.breeds.push(breed);
        await Promise.resolve();
    }
}
