import { beforeEach, describe, expect, it } from "bun:test";
import { InMemoryAssetRepository } from "test/repositories/in-memory-asset.repository";
import { FakeUploader } from "test/storage/fake-uploader";
import { InvalidAssetTypeError } from "../errors/invalid-asset-type.error";
import { UploadAndCreateAssetUseCase } from "./upload-and-create-asset.use-case";

let inMemoryAttachmentsRepository: InMemoryAssetRepository;
let fakeUploader: FakeUploader;

let sut: UploadAndCreateAssetUseCase;

describe("Upload and create attachment", () => {
	beforeEach(() => {
		inMemoryAttachmentsRepository = new InMemoryAssetRepository();
		fakeUploader = new FakeUploader();

		sut = new UploadAndCreateAssetUseCase(
			inMemoryAttachmentsRepository,
			fakeUploader,
		);
	});

	it("should be able to upload and create an attachment", async () => {
		const result = await sut.execute({
			fileName: "profile.png",
			fileType: "image/png",
			body: Buffer.from(""),
		});

		expect(result.isRight()).toBe(true);
		expect(result.value).toEqual({
			asset: inMemoryAttachmentsRepository.items[0],
		});
		expect(fakeUploader.uploads).toHaveLength(1);
		expect(fakeUploader.uploads[0]).toEqual(
			expect.objectContaining({
				fileName: "profile.png",
			}),
		);
	});

	it("should not be able to upload an attachment with invalid file type", async () => {
		const result = await sut.execute({
			fileName: "profile.mp3",
			fileType: "audio/mpeg",
			body: Buffer.from(""),
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(InvalidAssetTypeError);
	});
});
