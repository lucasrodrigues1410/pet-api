import { beforeEach, describe, expect, it, jest } from "bun:test";
import { Test } from "@nestjs/testing";
import { makeAnimal } from "test/factories/make-animal";
import { AssetRepository } from "@/modules/asset/domain/repositories/asset.repository";
import { AnimalRepository } from "../../domain/repositories/animal.repository";
import { UpdateAnimalUseCase } from "./update-animal.use-case";

describe("Update Animal", () => {
	let moduleRef: any;
	let sut: UpdateAnimalUseCase;

	const mockAnimalRepo = { findById: jest.fn(), update: jest.fn() };

	const mockAssetRepo = { existsByIds: jest.fn() };

	beforeEach(async () => {
		mockAnimalRepo.findById.mockReset();
		mockAnimalRepo.update.mockReset();
		mockAssetRepo.existsByIds.mockReset();

		moduleRef = await Test.createTestingModule({
			providers: [
				UpdateAnimalUseCase,
				{ provide: AnimalRepository, useValue: mockAnimalRepo },
				{ provide: AssetRepository, useValue: mockAssetRepo },
			],
		}).compile();

		sut = moduleRef.get(UpdateAnimalUseCase);
	});

	it("should be able to update an animal", async () => {
		const oldAnimal = makeAnimal();
		const newAnimal = makeAnimal();
		const updatedAnimal = { ...oldAnimal, name: newAnimal.name };

		const params = {
			animalId: oldAnimal.id.toString(),
			userId: oldAnimal.userId.toString(),
			name: newAnimal.name,
			age: newAnimal.age,
			weight: newAnimal.weight,
		};

		mockAnimalRepo.findById.mockResolvedValueOnce(oldAnimal);
		mockAssetRepo.existsByIds.mockResolvedValueOnce(true);
		mockAnimalRepo.update.mockResolvedValueOnce(updatedAnimal);

		const response = await sut.execute(params);

		expect(response.isRight()).toBeTruthy();
		expect(mockAnimalRepo.findById).toHaveBeenCalledWith(params.animalId);
		expect(mockAnimalRepo.update).toHaveBeenCalledWith(
			params.animalId,
			expect.objectContaining({ name: params.name, weight: params.weight }),
		);
	});

	it("should not be able to update an animal that does not exist", async () => {
		const oldAnimal = makeAnimal();
		const newAnimal = makeAnimal();

		const params = {
			animalId: "non-existing-id",
			userId: oldAnimal.userId.toString(),
			name: newAnimal.name,
			age: newAnimal.age,
			weight: newAnimal.weight,
		};

		mockAnimalRepo.findById.mockResolvedValueOnce(null);

		const response = await sut.execute(params);

		expect(response.isLeft()).toBeTruthy();
		expect(mockAnimalRepo.findById).toHaveBeenCalledWith(params.animalId);
		expect(mockAnimalRepo.update).not.toHaveBeenCalled();
	});

	it("should not be able to update an animal of another user", async () => {
		const oldAnimal = makeAnimal();
		const newAnimal = makeAnimal();

		const params = {
			animalId: oldAnimal.id.toString(),
			userId: newAnimal.userId.toString(),
			name: newAnimal.name,
			age: newAnimal.age,
			weight: newAnimal.weight,
		};

		mockAnimalRepo.findById.mockResolvedValueOnce(oldAnimal);

		const response = await sut.execute(params);

		expect(response.isLeft()).toBeTruthy();
		expect(mockAnimalRepo.findById).toHaveBeenCalledWith(params.animalId);
		expect(mockAnimalRepo.update).not.toHaveBeenCalled();
	});
});
