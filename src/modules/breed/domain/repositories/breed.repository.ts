import { Breed } from "../entities/breed.entity";

export interface FindBreedsParams {
	query?: string;
}

export abstract class BreedRepository {
	abstract getAll(params: FindBreedsParams): Promise<Breed[]>;
	abstract create(breed: Breed): Promise<void>;
}
