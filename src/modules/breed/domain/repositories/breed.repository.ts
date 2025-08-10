import { Breed } from "../entities/breed.entity";

export interface FindBreedsParams {
	query?: string;
}

export abstract class BreedRepository {
	abstract getAll(params: FindBreedsParams): Promise<Breed[]>;
	abstract findById(id: string): Promise<Breed | null>;
	abstract create(breed: Breed): Promise<void>;
}
