import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryAnimalRepository } from "test/repositories/in-memory-animal.repository";
import { ListAnimalsFromUserUserUseCase } from "./list-animals-from-user.use-case";
import { makeAnimal } from "test/factories/make-animal";

let inMemoryAnimalsRepository: InMemoryAnimalRepository;
let useCase: ListAnimalsFromUserUserUseCase;

describe("List Animals from User", () => {
	beforeEach(() => {
		inMemoryAnimalsRepository = new InMemoryAnimalRepository();
		useCase = new ListAnimalsFromUserUserUseCase(inMemoryAnimalsRepository);
	});

	it("should get animals", async () => {
		const animals = Array.from({ length: 5 }, () => makeAnimal({ userId: 1 }));

		for (const animal of animals) {
			inMemoryAnimalsRepository.animals.push(animal);
		}
		const result = await useCase.execute({ userId: 1 });

		expect(result.isRight()).toBe(true);
		expect(result.value?.animals).toHaveLength(5);
	});
});
