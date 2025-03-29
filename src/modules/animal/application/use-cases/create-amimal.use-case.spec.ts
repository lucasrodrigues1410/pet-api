import { beforeEach, describe, it, expect } from 'bun:test';
import { faker } from "@faker-js/faker";
import { UniqueEntityID } from "src/core/entities/unique-entity-id";
import { InMemoryAnimalRepository } from "test/repositories/in-memory-animal.repository";
import { CreateAnimalUseCase } from "./create-animal.use-case";
import { InMemoryAssetRepository } from 'test/repositories/in-memory-asset.repository';

let inMemoryAnimalRepository: InMemoryAnimalRepository;
let inMemoryAssetRepository: InMemoryAssetRepository;

let sut: CreateAnimalUseCase;

describe("Create Animal", () => {
	beforeEach(() => {
		inMemoryAnimalRepository = new InMemoryAnimalRepository();
		inMemoryAssetRepository = new InMemoryAssetRepository();

		sut = new CreateAnimalUseCase(inMemoryAnimalRepository, inMemoryAssetRepository);
	});

	it("should create an animal", async () => {
		const params = {
			birthdate: faker.date.past(),
			name: faker.animal.dog(),
			weight: faker.number.float({ min: 1, max: 100 }),
			userId: new UniqueEntityID().toString(),
			breedId: new UniqueEntityID().toString(),
		};

		await sut.execute(params);

		const animals = await inMemoryAnimalRepository.getAllByUser(params.userId);
		expect(animals).toHaveLength(1);
	});
});
