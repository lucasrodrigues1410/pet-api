import { Breed } from "../entities/breed.entity";

export abstract class BreedRepository {
    abstract getAll(): Promise<Breed[]>;
    abstract create(breed: Breed): Promise<void>;
}