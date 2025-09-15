import { beforeEach, describe, expect, it, jest } from "bun:test";
import { Test } from "@nestjs/testing";
import { makeAnimal } from "test/factories/make-animal";
import { AnimalRepository } from "../../domain/repositories/animal.repository";
import { ListAnimalsFromUserUserUseCase } from "./list-animals-from-user.use-case";

describe("List Animals from User", () => {
	let moduleRef: any;
	let sut: ListAnimalsFromUserUserUseCase;

	const mockAnimalRepo = { fetchAllAnimalsByUser: jest.fn() };

	beforeEach(async () => {
		mockAnimalRepo.fetchAllAnimalsByUser.mockReset();

		moduleRef = await Test.createTestingModule({
			providers: [
				ListAnimalsFromUserUserUseCase,
				{ provide: AnimalRepository, useValue: mockAnimalRepo },
			],
		}).compile();

		sut = moduleRef.get(ListAnimalsFromUserUserUseCase);
	});

	it("should get animals", async () => {
		const uniqueId = "user-id-123";
		const animals = Array.from({ length: 5 }, () => makeAnimal());
		const mockResult = { items: animals, total: 5, page: 1, limit: 5 };

		const params = { userId: uniqueId, page: 1, limit: 5 };

		mockAnimalRepo.fetchAllAnimalsByUser.mockResolvedValueOnce(mockResult);

		const result = await sut.execute(params);

		expect(result.isRight()).toBe(true);
		expect(result.value?.items).toHaveLength(5);
		expect(mockAnimalRepo.fetchAllAnimalsByUser).toHaveBeenCalledWith(params);
	});
});
