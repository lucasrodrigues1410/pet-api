import { beforeEach, describe, expect, it, jest } from "bun:test";
import { Test } from "@nestjs/testing";
import { makeAsset } from "test/factories/make-asset";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { AssetRepository } from "../../domain/repositories/asset.repository";
import { Uploader } from "../../domain/storage/uploader";
import { DeleteAssetByIdUseCase } from "./delete-asset-by-id.use-case";

describe("DeleteAssetByIdUseCase", () => {
	let moduleRef: any;
	let sut: DeleteAssetByIdUseCase;

	const mockAssetRepo = {
		create: jest.fn(),
		delete: jest.fn(),
		existsByIds: jest.fn(),
		findById: jest.fn(),
	};

	const mockUploader = { upload: jest.fn(), delete: jest.fn() };

	beforeEach(async () => {
		mockAssetRepo.create.mockReset();
		mockAssetRepo.delete.mockReset();
		mockAssetRepo.existsByIds.mockReset();
		mockAssetRepo.findById.mockReset();
		mockUploader.upload.mockReset();
		mockUploader.delete.mockReset();

		moduleRef = await Test.createTestingModule({
			providers: [
				DeleteAssetByIdUseCase,
				{ provide: AssetRepository, useValue: mockAssetRepo },
				{ provide: Uploader, useValue: mockUploader },
			],
		}).compile();

		sut = moduleRef.get(DeleteAssetByIdUseCase);
	});

	it("should be able to delete an asset by id", async () => {
		const asset = makeAsset();

		mockAssetRepo.findById.mockResolvedValueOnce(asset);
		mockAssetRepo.delete.mockResolvedValueOnce(undefined);
		mockUploader.delete.mockResolvedValueOnce(undefined);

		const result = await sut.execute({
			assetId: asset.id.toString(),
			userId: asset.userId.toString(),
		});

		expect(result.isRight()).toBe(true);
		expect(mockAssetRepo.findById).toHaveBeenCalledWith(asset.id.toString());
		expect(mockAssetRepo.delete).toHaveBeenCalledWith(asset.id.toString());
		expect(mockUploader.delete).toHaveBeenCalledWith(asset.fileId);
	});

	it("should not be able to delete an asset that does not exist", async () => {
		mockAssetRepo.findById.mockResolvedValueOnce(null);

		const result = await sut.execute({
			assetId: "non-existing-asset-id",
			userId: "non-existing-user-id",
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
		expect(mockAssetRepo.findById).toHaveBeenCalledWith(
			"non-existing-asset-id",
		);
		expect(mockAssetRepo.delete).not.toHaveBeenCalled();
		expect(mockUploader.delete).not.toHaveBeenCalled();
	});

	it("should not be able to delete an asset that is not owned by the user", async () => {
		const asset = makeAsset();

		mockAssetRepo.findById.mockResolvedValueOnce(asset);

		const result = await sut.execute({
			assetId: asset.id.toString(),
			userId: "non-existing-user-id",
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
		expect(mockAssetRepo.findById).toHaveBeenCalledWith(asset.id.toString());
		expect(mockAssetRepo.delete).not.toHaveBeenCalled();
		expect(mockUploader.delete).not.toHaveBeenCalled();
	});
});
