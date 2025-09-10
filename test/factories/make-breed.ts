import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { faker } from "@faker-js/faker";
import {
	Breed,
} from "src/modules/breed/domain/entities/breed.entity";

export function makeBreed(override: Partial<Breed> = {}, id?: UniqueEntityID) {
	const student = Breed.create(
		{
			name: faker.animal.type(),
			animalTypeId: new UniqueEntityID(),
			...override,
		},
		id,
	);

	return student;
}