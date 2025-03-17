import { InMemoryAnimalRepository } from "test/repositories/in-memory-animal.repository";
import { CreateAnimalUseCase } from "./create-animal.use-case";
import { beforeEach, describe, expect, it } from "vitest";
import { faker } from "@faker-js/faker";

let inMemoryAnimalRepository: InMemoryAnimalRepository;
let useCase: CreateAnimalUseCase;

describe("Create Animal", () => {
	beforeEach(() => {
		inMemoryAnimalRepository = new InMemoryAnimalRepository();
		useCase = new CreateAnimalUseCase(inMemoryAnimalRepository);
	});

	it("should create an animal", async () => {
		const params = {
			birthdate: faker.date.past(),
			name: faker.animal.dog(),
			weight: faker.number.float({ min: 1, max: 100 }),
			userId: faker.number.int({ min: 1, max: 10 }),
			breedId: faker.number.int({ min: 1, max: 10 }),
		};

		await useCase.execute(params);

		const animals = await inMemoryAnimalRepository.getAllByUser(params.userId);
		expect(animals).toHaveLength(1);
	});
});
