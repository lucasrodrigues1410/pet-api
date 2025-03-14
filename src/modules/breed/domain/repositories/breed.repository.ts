import { Breed } from "../entities/breed.entity";

export abstract class BreedRepository {
    abstract getAll(): Promise<Breed[]>;
}