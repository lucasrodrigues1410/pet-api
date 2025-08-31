import { beforeEach, describe, expect, it } from "bun:test";
import { makeUser } from "test/factories/make-user";
import { MockUploader } from "test/mocks/mock-uploader";
import { InMemoryAssetRepository } from "test/repositories/in-memory-asset.repository";
import { InMemoryUserRepository } from "test/repositories/in-memory-user.repository";
import { UploadAndCreateAssetUseCase } from "@/modules/asset/application/use-cases/upload-and-create-asset.use-case";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { AddAssetToUserUseCase } from "./add-asset-to-user.use-case";

let inMemoryUserRepository: InMemoryUserRepository;
let inMemoryAssetRepository: InMemoryAssetRepository;
let fakeUploader: MockUploader;

let sut: AddAssetToUserUseCase;
let uploadAndCreateAsset: UploadAndCreateAssetUseCase;

describe("Add Asset to User", () => {
	beforeEach(() => {
		inMemoryUserRepository = new InMemoryUserRepository();
		inMemoryAssetRepository = new InMemoryAssetRepository();
		fakeUploader = new MockUploader();

		uploadAndCreateAsset = new UploadAndCreateAssetUseCase(
			inMemoryAssetRepository,
			fakeUploader,
		);

		sut = new AddAssetToUserUseCase(
			inMemoryUserRepository,
			uploadAndCreateAsset,
		);
	});

	it("should be able to add an avatar to a user", async () => {
		const user = makeUser();
		await inMemoryUserRepository.create(user);

		const result = await sut.execute({
			userId: user.id.toString(),
			file: {
				buffer: Buffer.from(""),
				mimetype: "image/png",
				originalname: "avatar.png",
			} as Express.Multer.File,
		});

		expect(result.isRight()).toBe(true);

		// Check if user was updated with avatarAssetId
		const updatedUser = await inMemoryUserRepository.findById(
			user.id.toString(),
		);
		expect(updatedUser?.avatarAssetId).toBeDefined();
		expect(updatedUser?.avatarAssetId).not.toBeNull();

		// Check if asset was created
		expect(inMemoryAssetRepository.items).toHaveLength(1);
		expect(inMemoryAssetRepository.items[0].name).toBe(
			`user-${user.id.toString()}`,
		);
	});

	it("should not be able to add an avatar to a user that does not exist", async () => {
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
		await inMemoryUserRepository.create(user);

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
		await inMemoryUserRepository.create(user);

		// Verify user initially has no avatar
		expect(user.avatarAssetId).toBeUndefined();

		const result = await sut.execute({
			userId: user.id.toString(),
			file: {
				buffer: Buffer.from("test-image-content"),
				mimetype: "image/jpeg",
				originalname: "profile-picture.jpg",
			} as Express.Multer.File,
		});

		expect(result.isRight()).toBe(true);

		// Check that the user was updated with the asset ID
		const updatedUser = await inMemoryUserRepository.findById(
			user.id.toString(),
		);
		expect(updatedUser?.avatarAssetId).toBeDefined();

		// Verify the asset was created with the correct user ID
		const createdAsset = inMemoryAssetRepository.items[0];
		expect(createdAsset.userId.toString()).toBe(user.id.toString());
		expect(createdAsset.name).toBe(`user-${user.id.toString()}`);
	});

	it("should handle different image file types", async () => {
		const user = makeUser();
		await inMemoryUserRepository.create(user);

		const testCases = [
			{
				mimetype: "image/png",
				filename: "avatar.png",
			},
			{
				mimetype: "image/jpeg",
				filename: "avatar.jpg",
			},
		];

		for (const testCase of testCases) {
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
		await inMemoryUserRepository.create(user);

		// Add first avatar
		const firstResult = await sut.execute({
			userId: user.id.toString(),
			file: {
				buffer: Buffer.from("first-avatar"),
				mimetype: "image/png",
				originalname: "first-avatar.png",
			} as Express.Multer.File,
		});

		expect(firstResult.isRight()).toBe(true);

		const userAfterFirst = await inMemoryUserRepository.findById(
			user.id.toString(),
		);
		const firstAssetId = userAfterFirst?.avatarAssetId;

		// Add second avatar
		const secondResult = await sut.execute({
			userId: user.id.toString(),
			file: {
				buffer: Buffer.from("second-avatar"),
				mimetype: "image/jpeg",
				originalname: "second-avatar.jpg",
			} as Express.Multer.File,
		});

		expect(secondResult.isRight()).toBe(true);

		const userAfterSecond = await inMemoryUserRepository.findById(
			user.id.toString(),
		);
		const secondAssetId = userAfterSecond?.avatarAssetId;

		// Verify the avatar ID was updated
		expect(firstAssetId).toBeDefined();
		expect(secondAssetId).toBeDefined();
		expect(firstAssetId).not.toBe(secondAssetId);

		// Verify both assets were created
		expect(inMemoryAssetRepository.items).toHaveLength(2);
	});
});
