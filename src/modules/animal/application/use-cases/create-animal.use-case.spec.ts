import { beforeEach, describe, expect, it } from "bun:test";
import { faker } from "@faker-js/faker";
import { InMemoryAnimalRepository } from "test/repositories/in-memory-animal.repository";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { CreateAnimalUseCase } from "./create-animal.use-case";

let inMemoryAnimalRepository: InMemoryAnimalRepository;

let sut: CreateAnimalUseCase;

describe("Create Animal", () => {
	beforeEach(() => {
		inMemoryAnimalRepository = new InMemoryAnimalRepository();

		sut = new CreateAnimalUseCase(inMemoryAnimalRepository);
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

		const animals = await inMemoryAnimalRepository.fetchAllAnimalsByUser({
			limit: 10,
			page: 1,
			userId: params.userId,
		});
		expect(animals.items).toHaveLength(1);
	});
});
