import { beforeEach, describe, expect, it } from "bun:test";
import { makeAnimal } from "test/factories/make-animal";
import { InMemoryAnimalRepository } from "test/repositories/in-memory-animal.repository";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { ListAnimalsFromUserUserUseCase } from "./list-animals-from-user.use-case";

let inMemoryAnimalsRepository: InMemoryAnimalRepository;
let sut: ListAnimalsFromUserUserUseCase;

describe("List Animals from User", () => {
	beforeEach(() => {
		inMemoryAnimalsRepository = new InMemoryAnimalRepository();
		sut = new ListAnimalsFromUserUserUseCase(inMemoryAnimalsRepository);
	});

	it("should get animals", async () => {
		const uniqueId = new UniqueEntityID();
		const animals = Array.from({ length: 5 }, () =>
			makeAnimal({ userId: uniqueId }),
		);

		for (const animal of animals) {
			inMemoryAnimalsRepository.items.push(animal);
		}
		const result = await sut.execute({
			userId: uniqueId.toString(),
			page: 1,
			limit: 5,
		});

		expect(result.isRight()).toBe(true);
		expect(result.value?.items).toHaveLength(5);
	});
});
