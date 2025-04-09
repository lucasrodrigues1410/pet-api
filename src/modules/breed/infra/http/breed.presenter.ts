import { Breed } from "../../domain/entities/breed.entity";

export class BreedPresenter {
    static toHTTP(breed: Breed) {
        return {
            id: breed.id.toString(),
            name: breed.name,
        };
    }
}