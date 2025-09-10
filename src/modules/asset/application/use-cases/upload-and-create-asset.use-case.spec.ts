import { beforeEach, describe, expect, it, jest } from "bun:test";
import { Test } from "@nestjs/testing";
import { AssetRepository } from "../../domain/repositories/asset.repository";
import { Uploader } from "../../domain/storage/uploader";
import { InvalidAssetTypeError } from "../errors/invalid-asset-type.error";
import { UploadAndCreateAssetUseCase } from "./upload-and-create-asset.use-case";

describe("UploadAndCreateAssetUseCase", () => {
	let moduleRef: any;
	let sut: UploadAndCreateAssetUseCase;

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
				UploadAndCreateAssetUseCase,
				{ provide: AssetRepository, useValue: mockAssetRepo },
				{ provide: Uploader, useValue: mockUploader },
			],
		}).compile();

		sut = moduleRef.get(UploadAndCreateAssetUseCase);
	});

	it("should be able to upload and create an attachment", async () => {
		const mockUploadResponse = {
			id: "file-id",
			name: "profile.png",
			url: "https://example.com/profile.png",
			width: 100,
			height: 100,
			thumbnailUrl: "https://example.com/thumb-profile.png",
		};

		mockUploader.upload.mockResolvedValueOnce(mockUploadResponse);
		mockAssetRepo.create.mockResolvedValueOnce(undefined);

		const result = await sut.execute({
			fileName: "profile.png",
			file: {
				buffer: Buffer.from(""),
				mimetype: "image/png",
				originalname: "profile.png",
			} as Express.Multer.File,
			userId: "user-id",
		});

		expect(result.isRight()).toBe(true);
		expect(result.value).toEqual({
			asset: expect.objectContaining({
				name: "profile.png",
				url: "https://example.com/profile.png",
				fileType: "image/png",
			}),
		});
		expect(mockUploader.upload).toHaveBeenCalledWith({
			fileName: "profile.png",
			fileType: "image/png",
			body: Buffer.from(""),
			folder: "",
		});
		expect(mockAssetRepo.create).toHaveBeenCalledWith(
			expect.objectContaining({
				name: "profile.png",
				url: "https://example.com/profile.png",
				fileType: "image/png",
			}),
		);
	});

	it("should not be able to upload an attachment with invalid file type", async () => {
		const result = await sut.execute({
			fileName: "profile.mp3",
			file: {
				buffer: Buffer.from(""),
				mimetype: "audio/mpeg",
				originalname: "profile.mp3",
			} as Express.Multer.File,
			userId: "user-id",
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(InvalidAssetTypeError);
		expect(mockUploader.upload).not.toHaveBeenCalled();
		expect(mockAssetRepo.create).not.toHaveBeenCalled();
	});
});
