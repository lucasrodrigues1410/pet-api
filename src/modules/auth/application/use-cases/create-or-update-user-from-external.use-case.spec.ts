import { beforeEach, describe, expect, it, jest } from "bun:test";
import { Test } from "@nestjs/testing";
import { makeUser } from "test/factories/make-user";
import { UserRepository } from "@/modules/user/domain/repositories/user.repository";
import { CreateOrUpdateUserFromExternalUseCase } from "./create-or-update-user-from-external.use-case";

let mockUserRepository: {
	findByEmail: ReturnType<typeof jest.fn>;
	create: ReturnType<typeof jest.fn>;
	update: ReturnType<typeof jest.fn>;
};
let sut: CreateOrUpdateUserFromExternalUseCase;
let moduleRef: any;

describe("Create Or Update User From External Use Case", () => {
	beforeEach(async () => {
		mockUserRepository = {
			findByEmail: jest.fn(async () => null),
			create: jest.fn(async () => undefined),
			update: jest.fn(async () => undefined),
		};

		moduleRef = await Test.createTestingModule({
			providers: [
				CreateOrUpdateUserFromExternalUseCase,
				{ provide: UserRepository, useValue: mockUserRepository },
			],
		}).compile();

		sut = moduleRef.get(CreateOrUpdateUserFromExternalUseCase);
	});

	it("should create a new user when email does not exist", async () => {
		mockUserRepository.findByEmail.mockResolvedValueOnce(null);

		const result = await sut.execute({
			authProviderId: "auth-provider-123",
			email: "newuser@example.com",
			name: "New User",
			avatarUrl: "https://example.com/avatar.jpg",
		});

		expect(result.isRight()).toBe(true);
		if (result.isRight()) {
			expect(result.value.id).toBeDefined();
			expect(typeof result.value.id).toBe("string");
		}
		expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
			"newuser@example.com",
		);
		expect(mockUserRepository.create).toHaveBeenCalled();
		expect(mockUserRepository.update).not.toHaveBeenCalled();
	});

	it("should update existing user when email already exists", async () => {
		const existingUser = makeUser({
			email: "existing@example.com",
			name: "Old Name",
		});
		mockUserRepository.findByEmail.mockResolvedValueOnce(existingUser);

		const result = await sut.execute({
			authProviderId: "auth-provider-456",
			email: "existing@example.com",
			name: "Updated Name",
			avatarUrl: "https://example.com/new-avatar.jpg",
		});

		expect(result.isRight()).toBe(true);
		if (result.isRight()) {
			expect(result.value.id).toBe(existingUser.id.toString());
		}
		expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
			"existing@example.com",
		);
		expect(mockUserRepository.update).toHaveBeenCalledWith(
			existingUser.id.toString(),
			{
				name: "Updated Name",
				avatarUrl: "https://example.com/new-avatar.jpg",
				authProviderId: "auth-provider-456",
			},
		);
		expect(mockUserRepository.create).not.toHaveBeenCalled();
	});

	it("should create user without avatar URL", async () => {
		mockUserRepository.findByEmail.mockResolvedValueOnce(null);

		const result = await sut.execute({
			authProviderId: "auth-provider-789",
			email: "noavatar@example.com",
			name: "User Without Avatar",
		});

		expect(result.isRight()).toBe(true);
		if (result.isRight()) {
			expect(result.value.id).toBeDefined();
		}
		expect(mockUserRepository.create).toHaveBeenCalled();
		const createdUser = mockUserRepository.create.mock.calls[0][0];
		expect(createdUser.email).toBe("noavatar@example.com");
		expect(createdUser.name).toBe("User Without Avatar");
		expect(createdUser.avatarUrl).toBeUndefined();
	});

	it("should update user without avatar URL", async () => {
		const existingUser = makeUser({
			email: "update@example.com",
		});
		mockUserRepository.findByEmail.mockResolvedValueOnce(existingUser);

		const result = await sut.execute({
			authProviderId: "auth-provider-999",
			email: "update@example.com",
			name: "Updated User",
		});

		expect(result.isRight()).toBe(true);
		expect(mockUserRepository.update).toHaveBeenCalledWith(
			existingUser.id.toString(),
			{
				name: "Updated User",
				avatarUrl: undefined,
				authProviderId: "auth-provider-999",
			},
		);
	});

	it("should create user with correct auth provider ID", async () => {
		mockUserRepository.findByEmail.mockResolvedValueOnce(null);

		const result = await sut.execute({
			authProviderId: "clerk_user_12345",
			email: "clerk@example.com",
			name: "Clerk User",
			avatarUrl: "https://clerk.com/avatar.jpg",
		});

		expect(result.isRight()).toBe(true);
		expect(mockUserRepository.create).toHaveBeenCalled();
		const createdUser = mockUserRepository.create.mock.calls[0][0];
		expect(createdUser.authProviderId).toBe("clerk_user_12345");
	});

	it("should update existing user auth provider ID", async () => {
		const existingUser = makeUser({
			email: "existing@example.com",
			authProviderId: "old_provider_id",
		});
		mockUserRepository.findByEmail.mockResolvedValueOnce(existingUser);

		const result = await sut.execute({
			authProviderId: "new_provider_id",
			email: "existing@example.com",
			name: "User Name",
		});

		expect(result.isRight()).toBe(true);
		expect(mockUserRepository.update).toHaveBeenCalledWith(
			existingUser.id.toString(),
			{
				name: "User Name",
				avatarUrl: undefined,
				authProviderId: "new_provider_id",
			},
		);
	});

	it("should handle user creation with all fields", async () => {
		mockUserRepository.findByEmail.mockResolvedValueOnce(null);

		const result = await sut.execute({
			authProviderId: "full_auth_provider_123",
			email: "fulluser@example.com",
			name: "Full User Name",
			avatarUrl: "https://example.com/full-avatar.png",
		});

		expect(result.isRight()).toBe(true);
		if (result.isRight()) {
			expect(result.value.id).toBeDefined();
		}
		expect(mockUserRepository.create).toHaveBeenCalled();
		const createdUser = mockUserRepository.create.mock.calls[0][0];
		expect(createdUser.email).toBe("fulluser@example.com");
		expect(createdUser.name).toBe("Full User Name");
		expect(createdUser.authProviderId).toBe("full_auth_provider_123");
		expect(createdUser.avatarUrl).toBe("https://example.com/full-avatar.png");
	});

	it("should handle user update with all fields", async () => {
		const existingUser = makeUser({
			email: "fullupdate@example.com",
			name: "Old Full Name",
			authProviderId: "old_full_provider",
		});
		mockUserRepository.findByEmail.mockResolvedValueOnce(existingUser);

		const result = await sut.execute({
			authProviderId: "new_full_provider_456",
			email: "fullupdate@example.com",
			name: "New Full Name",
			avatarUrl: "https://example.com/new-full-avatar.png",
		});

		expect(result.isRight()).toBe(true);
		if (result.isRight()) {
			expect(result.value.id).toBe(existingUser.id.toString());
		}
		expect(mockUserRepository.update).toHaveBeenCalledWith(
			existingUser.id.toString(),
			{
				name: "New Full Name",
				avatarUrl: "https://example.com/new-full-avatar.png",
				authProviderId: "new_full_provider_456",
			},
		);
	});
});
