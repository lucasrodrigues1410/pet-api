import { Injectable } from "@nestjs/common";
import { Animal } from "../../domain/entities/animal.entity";
import { IAnimalRepository } from "../../domain/repositories/animal.repository";

@Injectable()
export class CreateAnimalUseCase {
    constructor(private readonly animalRepository: IAnimalRepository) {}

    async execute(pet: Animal): Promise<{ id: number }> {
        return this.animalRepository.createAnimal(pet);
    }
}