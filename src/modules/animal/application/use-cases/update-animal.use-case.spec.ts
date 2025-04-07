import { beforeEach, describe, expect, it } from "bun:test";
import { makeAnimal } from "test/factories/make-animal";
import { MockEventDispatcher } from "test/mocks/mock-event-dispatcher";
import { InMemoryAnimalRepository } from "test/repositories/in-memory-animal.repository";
import { InMemoryAssetRepository } from "test/repositories/in-memory-asset.repository";
import { UpdateAnimalUseCase } from "./update-animal.use-case";

let inMemoryAnimalRepository: InMemoryAnimalRepository;
let inMemoryAssetRepository: InMemoryAssetRepository;
let eventDispatcher: MockEventDispatcher;

let sut: UpdateAnimalUseCase;

describe("Update", () => {
	beforeEach(() => {
		inMemoryAnimalRepository = new InMemoryAnimalRepository();
		inMemoryAssetRepository = new InMemoryAssetRepository();
		eventDispatcher = new MockEventDispatcher();

		sut = new UpdateAnimalUseCase(
			inMemoryAnimalRepository,
			inMemoryAssetRepository,
			eventDispatcher,
		);
	});

	it("should be able to update an animal", async () => {
		const oldAnimal = makeAnimal();
		await inMemoryAnimalRepository.create(oldAnimal);

		const newAnimal = makeAnimal();
		const response = await sut.execute({
			id: oldAnimal.id.toString(),
			name: newAnimal.name,
			birthdate: newAnimal.birthdate,
			weight: newAnimal.weight,
		});

		expect(response.isRight()).toBeTruthy();
		expect(inMemoryAnimalRepository.items).toHaveLength(1);
		expect(inMemoryAnimalRepository.items[0].name).toEqual(newAnimal.name);
	});

	it("should not be able to update an animal that does not exist", async () => {
		const oldAnimal = makeAnimal();
		await inMemoryAnimalRepository.create(oldAnimal);

		const newAnimal = makeAnimal();
		const response = await sut.execute({
			id: "non-existing-id",
			name: newAnimal.name,
			birthdate: newAnimal.birthdate,
			weight: newAnimal.weight,
		});

		expect(response.isLeft()).toBeTruthy();
		expect(inMemoryAnimalRepository.items).toHaveLength(1);
	});
});
