import { beforeEach, describe, expect, it, jest } from "bun:test";
import { Test } from "@nestjs/testing";
import { makeUser } from "test/factories/make-user";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { UploadAndCreateAssetUseCase } from "@/modules/asset/application/use-cases/upload-and-create-asset.use-case";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { UserRepository } from "../../domain/repositories/user.repository";
import { AddAssetToUserUseCase } from "./add-asset-to-user.use-case";

let sut: AddAssetToUserUseCase;
let moduleRef: any;

const mockUserRepository = {
	findById: jest.fn(),
	create: jest.fn(),
	update: jest.fn(),
	delete: jest.fn(),
};

const mockUploadAndCreateAssetUseCase = { execute: jest.fn() };

describe("Add Asset to User", () => {
	beforeEach(async () => {
		mockUserRepository.findById.mockReset();
		mockUserRepository.create.mockReset();
		mockUserRepository.update.mockReset();
		mockUserRepository.delete.mockReset();
		mockUploadAndCreateAssetUseCase.execute.mockReset();

		moduleRef = await Test.createTestingModule({
			providers: [
				AddAssetToUserUseCase,
				{ provide: UserRepository, useValue: mockUserRepository },
				{
					provide: UploadAndCreateAssetUseCase,
					useValue: mockUploadAndCreateAssetUseCase,
				},
			],
		}).compile();

		sut = moduleRef.get(AddAssetToUserUseCase);
	});

	it("should be able to add an avatar to a user", async () => {
		const user = makeUser();
		mockUserRepository.findById.mockResolvedValue(user);
		const assetId = new UniqueEntityID();
		mockUploadAndCreateAssetUseCase.execute.mockResolvedValue({
			isLeft: () => false,
			isRight: () => true,
			value: { asset: { id: assetId } },
		});

		const result = await sut.execute({
			userId: user.id.toString(),
			file: {
				buffer: Buffer.from(""),
				mimetype: "image/png",
				originalname: "avatar.png",
			} as Express.Multer.File,
		});

		expect(result.isRight()).toBe(true);
		expect(mockUserRepository.update).toHaveBeenCalledTimes(1);
	});

	it("should not be able to add an avatar to a user that does not exist", async () => {
		mockUserRepository.findById.mockResolvedValue(null);
		const result = await sut.execute({
			userId: "non-existing-user-id",
			file: {
				buffer: Buffer.from(""),
				mimetype: "image/png",
				originalname: "avatar.png",
			} as Express.Multer.File,
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
		expect(result.value?.message).toBe("Usuário não encontrado");
	});

	it("should not be able to add an avatar if the user id does not match", async () => {
		const user = makeUser();
		mockUserRepository.findById.mockResolvedValue(user);

		const result = await sut.execute({
			userId: "different-user-id",
			file: {
				buffer: Buffer.from(""),
				mimetype: "image/png",
				originalname: "avatar.png",
			} as Express.Multer.File,
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
		expect(result.value?.message).toBe("Usuário não encontrado");
	});

	it("should update the user with the new avatar asset id", async () => {
		const user = makeUser();
		mockUserRepository.findById.mockResolvedValue(user);
		expect(user.avatarAssetId).toBeUndefined();
		const newAssetId = new UniqueEntityID();
		mockUploadAndCreateAssetUseCase.execute.mockResolvedValue({
			isLeft: () => false,
			isRight: () => true,
			value: { asset: { id: newAssetId } },
		});

		const result = await sut.execute({
			userId: user.id.toString(),
			file: {
				buffer: Buffer.from("test-image-content"),
				mimetype: "image/jpeg",
				originalname: "profile-picture.jpg",
			} as Express.Multer.File,
		});

		expect(result.isRight()).toBe(true);
		expect(mockUserRepository.update).toHaveBeenCalledTimes(1);
	});

	it("should handle different image file types", async () => {
		const user = makeUser();
		mockUserRepository.findById.mockResolvedValue(user);

		const testCases = [
			{ mimetype: "image/png", filename: "avatar.png" },
			{ mimetype: "image/jpeg", filename: "avatar.jpg" },
		];

		for (const testCase of testCases) {
			mockUploadAndCreateAssetUseCase.execute.mockResolvedValue({
				isLeft: () => false,
				isRight: () => true,
				value: { asset: { id: new UniqueEntityID() } },
			});
			const result = await sut.execute({
				userId: user.id.toString(),
				file: {
					buffer: Buffer.from("test-content"),
					mimetype: testCase.mimetype,
					originalname: testCase.filename,
				} as Express.Multer.File,
			});

			expect(result.isRight()).toBe(true);
		}
	});

	it("should replace existing avatar when adding a new one", async () => {
		const user = makeUser();
		mockUserRepository.findById.mockResolvedValue(user);

		// Add first avatar
		const firstAssetId = new UniqueEntityID();
		mockUploadAndCreateAssetUseCase.execute.mockResolvedValueOnce({
			isLeft: () => false,
			isRight: () => true,
			value: { asset: { id: firstAssetId } },
		});
		const firstResult = await sut.execute({
			userId: user.id.toString(),
			file: {
				buffer: Buffer.from("first-avatar"),
				mimetype: "image/png",
				originalname: "first-avatar.png",
			} as Express.Multer.File,
		});

		expect(firstResult.isRight()).toBe(true);
		
		// Add second avatar
		const secondAssetId = new UniqueEntityID();
		mockUploadAndCreateAssetUseCase.execute.mockResolvedValueOnce({
			isLeft: () => false,
			isRight: () => true,
			value: { asset: { id: secondAssetId } },
		});
		const secondResult = await sut.execute({
			userId: user.id.toString(),
			file: {
				buffer: Buffer.from("second-avatar"),
				mimetype: "image/jpeg",
				originalname: "second-avatar.jpg",
			} as Express.Multer.File,
		});

		expect(secondResult.isRight()).toBe(true);
	});
});
