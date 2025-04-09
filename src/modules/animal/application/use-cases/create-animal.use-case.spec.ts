import { beforeEach, describe, expect, it } from "bun:test";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { faker } from "@faker-js/faker";
import { InMemoryAnimalRepository } from "test/repositories/in-memory-animal.repository";
import { InMemoryAssetRepository } from "test/repositories/in-memory-asset.repository";
import { CreateAnimalUseCase } from "./create-animal.use-case";

let inMemoryAnimalRepository: InMemoryAnimalRepository;
let inMemoryAssetRepository: InMemoryAssetRepository;

let sut: CreateAnimalUseCase;

describe("Create Animal", () => {
	beforeEach(() => {
		inMemoryAnimalRepository = new InMemoryAnimalRepository();
		inMemoryAssetRepository = new InMemoryAssetRepository();

		sut = new CreateAnimalUseCase(
			inMemoryAnimalRepository,
			inMemoryAssetRepository,
		);
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

		const animals = await inMemoryAnimalRepository.getAllByUser({
			limit: 10,
			page: 1,
			userId: params.userId,
		});
		expect(animals.items).toHaveLength(1);
	});
});
