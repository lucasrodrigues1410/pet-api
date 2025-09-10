import { beforeEach, describe, expect, it, jest } from "bun:test";
import { Test } from "@nestjs/testing";
import { makeBreed } from "test/factories/make-breed";
import { BreedRepository } from "../../domain/repositories/breed.repository";
import { ListBreedsUseCase } from "./list-breeds.use-case";

let moduleRef: any;
let sut: ListBreedsUseCase;
const mockBreedRepository = {
	getAll: jest.fn(),
	findById: jest.fn(),
	create: jest.fn(),
};

describe("List Breeds", () => {
	beforeEach(async () => {
		mockBreedRepository.getAll.mockReset();
		mockBreedRepository.findById.mockReset();
		mockBreedRepository.create.mockReset();

		moduleRef = await Test.createTestingModule({
			providers: [
				ListBreedsUseCase,
				{ provide: BreedRepository, useValue: mockBreedRepository },
			],
		}).compile();

		sut = moduleRef.get(ListBreedsUseCase);
	});

	it("should get a breeds", async () => {
		const breeds = Array.from({ length: 5 }, () => makeBreed());
		mockBreedRepository.getAll.mockResolvedValueOnce(breeds);
		const result = await sut.execute({});

		expect(result.isRight()).toBe(true);
		expect(result.value?.items).toHaveLength(5);
		expect(mockBreedRepository.getAll).toHaveBeenCalledWith({ query: "" });
	});
});
