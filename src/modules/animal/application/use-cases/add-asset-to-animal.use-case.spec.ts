import { beforeEach, describe, expect, it, jest } from "bun:test"; // ou jest
import { Test } from "@nestjs/testing";
import { makeAnimal } from "test/factories/make-animal";
import { UploadAndCreateAssetUseCase } from "@/modules/asset/application/use-cases/upload-and-create-asset.use-case";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { AnimalRepository } from "../../domain/repositories/animal.repository";
import { AddAssetToAnimalUseCase } from "./add-asset-to-animal.use-case";

describe("Add Asset to Animal", () => {
	let moduleRef: any;
	let sut: AddAssetToAnimalUseCase;

	const mockAnimalRepo = {
		findById: jest.fn(),
		update: jest.fn(),
		save: jest.fn(),
	};

	const mockUploadAndCreateAsset = { execute: jest.fn() };

	beforeEach(async () => {
		mockAnimalRepo.findById.mockReset();
		mockAnimalRepo.update.mockReset();
		mockAnimalRepo.save.mockReset();
		mockUploadAndCreateAsset.execute.mockReset();

		moduleRef = await Test.createTestingModule({
			providers: [
				AddAssetToAnimalUseCase,
				{
					provide: UploadAndCreateAssetUseCase,
					useValue: mockUploadAndCreateAsset,
				},
				{ provide: AnimalRepository, useValue: mockAnimalRepo },
			],
		}).compile();

		sut = moduleRef.get(AddAssetToAnimalUseCase);
	});

	it("should add asset to animal", async () => {
		const animal = makeAnimal();
		mockAnimalRepo.findById.mockResolvedValueOnce(animal);
		mockUploadAndCreateAsset.execute.mockResolvedValueOnce({
			isRight: () => true,
			isLeft: () => false,
			value: { asset: { id: "asset-id-123" } },
		});

		mockAnimalRepo.update.mockResolvedValueOnce({
			...animal,
			assetId: "asset-id-123",
		});

		const result = await sut.execute({
			animalId: animal.id.toString(),
			userId: animal.userId.toString(),
			file: {
				buffer: Buffer.from(""),
				mimetype: "image/png",
				originalname: "profile.png",
			} as Express.Multer.File,
		});

		expect(result.isRight()).toBe(true);
		expect(mockAnimalRepo.findById).toHaveBeenCalledWith(animal.id.toString());
		expect(mockUploadAndCreateAsset.execute).toHaveBeenCalled();
		expect(mockAnimalRepo.update).toHaveBeenCalledWith(animal.id.toString(), {
			assetId: "asset-id-123",
		});
	});

	it("should not be able to add an asset to an animal that does not belong to the user", async () => {
		const animal = makeAnimal();
		mockAnimalRepo.findById.mockResolvedValueOnce(animal);

		const result = await sut.execute({
			animalId: animal.id.toString(),
			userId: "another-user-id",
			file: {
				buffer: Buffer.from(""),
				mimetype: "image/png",
				originalname: "profile.png",
			} as Express.Multer.File,
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
		expect(mockAnimalRepo.update).not.toHaveBeenCalled();
	});
});
