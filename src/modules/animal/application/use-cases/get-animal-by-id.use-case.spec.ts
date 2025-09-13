import { beforeEach, describe, expect, it, jest } from "bun:test";
import { Test } from "@nestjs/testing";
import { makeAnimal } from "test/factories/make-animal";
import { AnimalRepository } from "../../domain/repositories/animal.repository";
import { GetAnimalByIdUseCase } from "./get-animal-by-id.use-case";

describe("Get Animal By ID", () => {
	let moduleRef: any;
	let sut: GetAnimalByIdUseCase;

	const mockAnimalRepo = { findByIdWithRelations: jest.fn() };

	beforeEach(async () => {
		mockAnimalRepo.findByIdWithRelations.mockReset();

		moduleRef = await Test.createTestingModule({
			providers: [
				GetAnimalByIdUseCase,
				{ provide: AnimalRepository, useValue: mockAnimalRepo },
			],
		}).compile();

		sut = moduleRef.get(GetAnimalByIdUseCase);
	});

	it("should be able to get an animal by id", async () => {
		const animal = makeAnimal();
		const params = {
			animalId: animal.id.toString(),
			userId: animal.userId.toString(),
		};

		mockAnimalRepo.findByIdWithRelations.mockResolvedValueOnce(animal);

		const response = await sut.execute(params);

		expect(response.isRight()).toBeTruthy();
		expect(mockAnimalRepo.findByIdWithRelations).toHaveBeenCalledWith(
			params.animalId,
		);
		if (response.isRight()) {
			expect(response.value.animal).toEqual(animal);
		}
	});

	it("should not be able to get an animal that does not exist", async () => {
		const animal = makeAnimal();
		const params = {
			animalId: "non-existing-id",
			userId: animal.userId.toString(),
		};

		mockAnimalRepo.findByIdWithRelations.mockResolvedValueOnce(null);

		const response = await sut.execute(params);

		expect(response.isLeft()).toBeTruthy();
		expect(mockAnimalRepo.findByIdWithRelations).toHaveBeenCalledWith(
			params.animalId,
		);
	});

	it("should not be able to get an animal that does not belong to the user", async () => {
		const animal = makeAnimal();
		const params = {
			animalId: animal.id.toString(),
			userId: "non-existing-user-id",
		};

		mockAnimalRepo.findByIdWithRelations.mockResolvedValueOnce(animal);

		const response = await sut.execute(params);

		expect(response.isLeft()).toBeTruthy();
		expect(mockAnimalRepo.findByIdWithRelations).toHaveBeenCalledWith(
			params.animalId,
		);
	});
});
