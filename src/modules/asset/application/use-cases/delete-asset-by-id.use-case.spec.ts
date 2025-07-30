import { beforeEach, describe, expect, it } from "bun:test";
import { makeAsset } from "test/factories/make-asset";
import { MockUploader } from "test/mocks/mock-uploader";
import { InMemoryAssetRepository } from "test/repositories/in-memory-asset.repository";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { DeleteAssetByIdUseCase } from "./delete-asset-by-id.use-case";

let assetRepository: InMemoryAssetRepository;
let uploader: MockUploader;

let sut: DeleteAssetByIdUseCase;

describe("Delete asset by id", () => {
	beforeEach(() => {
		assetRepository = new InMemoryAssetRepository();
		uploader = new MockUploader();

		sut = new DeleteAssetByIdUseCase(assetRepository, uploader);
	});

	it("should be able to delete an asset by id", async () => {
		const asset = makeAsset();
		uploader.items.push({
			fileName: asset.name,
			url: asset.url,
			id: asset.id.toString(),
		});
		assetRepository.items.push(asset);

		const result = await sut.execute({
			assetId: asset.id.toString(),
			userId: asset.userId.toString(),
		});

		expect(result.isRight()).toBe(true);
		expect(assetRepository.items).toHaveLength(0);
	});

	it("should not be able to delete an asset that does not exist", async () => {
		const result = await sut.execute({
			assetId: "non-existing-asset-id",
			userId: "non-existing-user-id",
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});

	it("should not able to delete an asset that is not pertent to the user", async () => {
		const asset = makeAsset();
		uploader.items.push({
			fileName: asset.name,
			url: asset.url,
			id: asset.id.toString(),
		});
		assetRepository.items.push(asset);

		const result = await sut.execute({
			assetId: asset.id.toString(),
			userId: "non-existing-user-id",
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
		expect(assetRepository.items).toHaveLength(1);
		expect(uploader.items).toHaveLength(1);
		expect(uploader.items[0].id).toBe(asset.id.toString());
	});
});
