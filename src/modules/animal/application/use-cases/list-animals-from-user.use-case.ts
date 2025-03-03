import { Injectable } from "@nestjs/common";
import { Animal } from "../../domain/entities/animal.entity";
import { IAnimalRepository } from "../../domain/repositories/animal.repository";

@Injectable()
export class ListAnimalsFromUserUserUseCase {
    constructor(private readonly animalRepository: IAnimalRepository) {}

    async execute(userId: number): Promise<Animal[]> {
        return this.animalRepository.getAnimalsByUser(userId);
    }
}