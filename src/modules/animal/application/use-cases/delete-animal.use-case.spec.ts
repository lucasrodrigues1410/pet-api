import { beforeEach, describe, expect, it, jest } from "bun:test";
import { Test } from "@nestjs/testing";
import { makeAnimal } from "test/factories/make-animal";
import { AnimalRepository } from "../../domain/repositories/animal.repository";
import { DeleteAnimalUseCase } from "./delete-animal.use-case";

describe("Delete Animal", () => {
	let moduleRef: any;
	let sut: DeleteAnimalUseCase;

	const mockAnimalRepo = { findById: jest.fn(), delete: jest.fn() };

	beforeEach(async () => {
		mockAnimalRepo.findById.mockReset();
		mockAnimalRepo.delete.mockReset();

		moduleRef = await Test.createTestingModule({
			providers: [
				DeleteAnimalUseCase,
				{ provide: AnimalRepository, useValue: mockAnimalRepo },
			],
		}).compile();

		sut = moduleRef.get(DeleteAnimalUseCase);
	});

	it("should be able to delete an animal", async () => {
		const animal = makeAnimal();
		const params = {
			animalId: animal.id.toString(),
			userId: animal.userId.toString(),
		};

		mockAnimalRepo.findById.mockResolvedValueOnce(animal);
		mockAnimalRepo.delete.mockResolvedValueOnce(undefined);

		const response = await sut.execute(params);

		expect(response.isRight()).toBeTruthy();
		expect(mockAnimalRepo.findById).toHaveBeenCalledWith(params.animalId);
		expect(mockAnimalRepo.delete).toHaveBeenCalledWith(params.animalId);
	});

	it("should not be able to delete an animal that does not exist", async () => {
		const animal = makeAnimal();
		const params = {
			animalId: "non-existing-id",
			userId: animal.userId.toString(),
		};

		mockAnimalRepo.findById.mockResolvedValueOnce(null);

		const response = await sut.execute(params);

		expect(response.isLeft()).toBeTruthy();
		expect(mockAnimalRepo.findById).toHaveBeenCalledWith(params.animalId);
		expect(mockAnimalRepo.delete).not.toHaveBeenCalled();
	});

	it("should not be able to delete an animal that does not belong to the user", async () => {
		const animal = makeAnimal();
		const params = {
			animalId: animal.id.toString(),
			userId: "non-existing-user-id",
		};

		mockAnimalRepo.findById.mockResolvedValueOnce(animal);

		const response = await sut.execute(params);

		expect(response.isLeft()).toBeTruthy();
		expect(mockAnimalRepo.findById).toHaveBeenCalledWith(params.animalId);
		expect(mockAnimalRepo.delete).not.toHaveBeenCalled();
	});
});
