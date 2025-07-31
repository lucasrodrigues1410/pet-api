import { beforeEach, describe, expect, it } from "bun:test";
import { makeAnimal } from "test/factories/make-animal";
import { MockUploader } from "test/mocks/mock-uploader";
import { InMemoryAnimalRepository } from "test/repositories/in-memory-animal.repository";
import { InMemoryAssetRepository } from "test/repositories/in-memory-asset.repository";
import { UploadAndCreateAssetUseCase } from "@/modules/asset/application/use-cases/upload-and-create-asset.use-case";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { AddAssetToAnimalUseCase } from "./add-asset-to-animal.use-case";

let inMemoryAnimalRepository: InMemoryAnimalRepository;
let inMemoryAssetRepository: InMemoryAssetRepository;
let fakeUploader: MockUploader;

let sut: AddAssetToAnimalUseCase;
let uploadAndCreateAsset: UploadAndCreateAssetUseCase;

describe("Add Asset to Animal", () => {
	beforeEach(() => {
		inMemoryAnimalRepository = new InMemoryAnimalRepository();
		inMemoryAssetRepository = new InMemoryAssetRepository();
		fakeUploader = new MockUploader();

		uploadAndCreateAsset = new UploadAndCreateAssetUseCase(
			inMemoryAssetRepository,
			fakeUploader,
		);

		sut = new AddAssetToAnimalUseCase(
			inMemoryAnimalRepository,
			uploadAndCreateAsset,
		);
	});

	it("should be able to add an asset to an animal", async () => {
		const animal = makeAnimal();
		inMemoryAnimalRepository.create(animal);

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
	});

	it("should not be able to add an asset to an animal that does not exist", async () => {
		const result = await sut.execute({
			animalId: "non-existing-animal-id",
			userId: "user-id",
			file: {
				buffer: Buffer.from(""),
				mimetype: "image/png",
				originalname: "profile.png",
			} as Express.Multer.File,
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});

	it("should not be able to add an asset to an animal that does not belong to the user", async () => {
		const animal = makeAnimal();
		inMemoryAnimalRepository.create(animal);

		const result = await sut.execute({
			animalId: animal.id.toString(),
			userId: "user-id-2",
			file: {
				buffer: Buffer.from(""),
				mimetype: "image/png",
				originalname: "profile.png",
			} as Express.Multer.File,
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});
});
