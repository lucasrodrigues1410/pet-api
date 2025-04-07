import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/core/infra/prisma/prisma.service";
import {
	Animal,
	AnimalProps,
} from "src/modules/animal/domain/entities/animal.entity";
import { AnimalPrismaMapper } from "src/modules/animal/infra/database/mappers/prisma-animal.mapper";

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

@Injectable()
export class AnimalFactory {
	constructor(private prisma: PrismaService) {}

	async makePrismaAnimal(data: Partial<AnimalProps> = {}): Promise<Animal> {
		const animal = makeAnimal(data);

		await this.prisma.animal.create({
			data: AnimalPrismaMapper.toPrisma(animal),
		});

		return animal;
	}
}
