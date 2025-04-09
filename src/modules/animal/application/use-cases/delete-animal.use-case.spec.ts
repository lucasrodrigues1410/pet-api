import { beforeEach, describe, expect, it } from "bun:test";
import { makeAnimal } from "test/factories/make-animal";
import { MockEventDispatcher } from "test/mocks/mock-event-dispatcher";
import { InMemoryAnimalRepository } from "test/repositories/in-memory-animal.repository";
import { DeleteAnimalUseCase } from "./delete-animal.use-case";

let inMemoryAnimalRepository: InMemoryAnimalRepository;
let eventDispatcher: MockEventDispatcher;

let sut: DeleteAnimalUseCase;

describe("DeleteAnimalUseCase", () => {
	beforeEach(() => {
		inMemoryAnimalRepository = new InMemoryAnimalRepository();
		eventDispatcher = new MockEventDispatcher();

		sut = new DeleteAnimalUseCase(inMemoryAnimalRepository, eventDispatcher);
	});

	it("should be able to delete an animal", async () => {
		const animal = makeAnimal();
		await inMemoryAnimalRepository.create(animal);

		const response = await sut.execute({
			animalId: animal.id.toString(),
			userId: animal.userId.toString(),
		});

		expect(response.isRight()).toBeTruthy();
		expect(inMemoryAnimalRepository.items).toHaveLength(0);
	});

	it("should not be able to delete an animal that does not exist", async () => {
		const animal = makeAnimal();
		await inMemoryAnimalRepository.create(animal);

		const response = await sut.execute({
			animalId: "non-existing-id",
			userId: animal.userId.toString(),
		});

		expect(response.isLeft()).toBeTruthy();
		expect(inMemoryAnimalRepository.items).toHaveLength(1);
	});

	it("should not be able to delete an animal that does not belong to the user", async () => {
		const animal = makeAnimal();
		await inMemoryAnimalRepository.create(animal);

		const response = await sut.execute({
			animalId: animal.id.toString(),
			userId: "non-existing-user-id",
		});

		expect(response.isLeft()).toBeTruthy();
		expect(inMemoryAnimalRepository.items).toHaveLength(1);
	});
});
