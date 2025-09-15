import { faker } from "@faker-js/faker";
import {
	Animal,
} from "src/modules/animal/domain/entities/animal.entity";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";

export function makeAnimal(
	override: Partial<Animal> = {},
	id?: UniqueEntityID,
) {
	const animal = Animal.create(
		{
			birthdate: faker.date.past(),
			name: faker.animal.dog(),
			weight: faker.number.float({ min: 1, max: 100 }),
			userId: new UniqueEntityID(),
			breedId: new UniqueEntityID(),
			...override,
		},
		id,
	);

	return animal;
}