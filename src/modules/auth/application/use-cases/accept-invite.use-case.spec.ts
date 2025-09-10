import { beforeEach, describe, expect, it, jest } from "bun:test";
import { Test } from "@nestjs/testing";
import { makeUser } from "test/factories/make-user";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { Invite } from "@/modules/invite/domain/entities/invite.entity";
import {
	InviteAlreadyUsedError,
	InviteExpiredError,
	InviteNotFoundError,
} from "@/modules/invite/domain/errors/error";
import { InviteRepository } from "@/modules/invite/domain/repositories/invite.repository";
import { UserRepository } from "@/modules/user/domain/repositories/user.repository";
import { right } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { HashGenerator } from "../../domain/interfaces/hash-generator.interface";
import { AcceptInviteUseCase } from "./accept-invite.use-case";
import { SignInUseCase } from "./sign-in.use-case";

describe("AcceptInviteUseCase", () => {
	let moduleRef: any;
	let sut: AcceptInviteUseCase;

	const mockInviteRepo = {
		findByToken: jest.fn(),
		create: jest.fn(),
		update: jest.fn(),
		delete: jest.fn(),
		markAsUsedIfUnused: jest.fn(),
	};

	const mockUserRepo = {
		findByEmail: jest.fn(),
		findById: jest.fn(),
		create: jest.fn(),
		update: jest.fn(),
		delete: jest.fn(),
	};

	const mockHashGenerator = { hash: jest.fn() };

	const mockSignInUseCase = { execute: jest.fn() };

	beforeEach(async () => {
		mockInviteRepo.findByToken.mockReset();
		mockInviteRepo.create.mockReset();
		mockInviteRepo.update.mockReset();
		mockInviteRepo.delete.mockReset();
		mockInviteRepo.markAsUsedIfUnused.mockReset();
		mockUserRepo.findByEmail.mockReset();
		mockUserRepo.findById.mockReset();
		mockUserRepo.create.mockReset();
		mockUserRepo.update.mockReset();
		mockUserRepo.delete.mockReset();
		mockHashGenerator.hash.mockReset();
		mockSignInUseCase.execute.mockReset();

		moduleRef = await Test.createTestingModule({
			providers: [
				AcceptInviteUseCase,
				{ provide: InviteRepository, useValue: mockInviteRepo },
				{ provide: UserRepository, useValue: mockUserRepo },
				{ provide: HashGenerator, useValue: mockHashGenerator },
				{ provide: SignInUseCase, useValue: mockSignInUseCase },
			],
		}).compile();

		sut = moduleRef.get(AcceptInviteUseCase);
	});

	it("should accept invite successfully", async () => {
		const user = makeUser({
			email: "employee@example.com",
			name: "Test Employee",
			type: "company",
		});

		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() + 7);

		const invite = Invite.create({
			userId: user.id,
			token: "valid-token",
			expiresAt,
		});

		const hashedPassword = "hashed-password";
		const signInResult = {
			id: user.id,
			name: user.name,
			email: user.email,
			type: user.type,
			password: user.password,
			avatar: user.avatar,
			accessToken: "access-token",
			staffRole: "admin",
			companyId: "company-id",
		};

		mockInviteRepo.findByToken.mockResolvedValueOnce(invite);
		mockUserRepo.findById.mockResolvedValueOnce(user);
		mockHashGenerator.hash.mockResolvedValueOnce(hashedPassword);
		mockUserRepo.update.mockResolvedValueOnce(undefined);
		mockInviteRepo.markAsUsedIfUnused.mockResolvedValueOnce(true);
		mockSignInUseCase.execute.mockResolvedValueOnce(right(signInResult));

		const result = await sut.execute({
			token: "valid-token",
			password: "newpassword123",
		});

		expect(result.isRight()).toBe(true);

		if (result.isRight()) {
			const { user, accessToken } = result.value;

			expect(user.email).toBe("employee@example.com");
			expect(user.name).toBe("Test Employee");
			expect(accessToken).toBe("access-token");
		}

		expect(mockInviteRepo.findByToken).toHaveBeenCalledWith("valid-token");
		expect(mockUserRepo.findById).toHaveBeenCalledWith(user.id.toString());
		expect(mockHashGenerator.hash).toHaveBeenCalledWith("newpassword123");
		expect(mockUserRepo.update).toHaveBeenCalledWith(user.id.toString(), {
			password: hashedPassword,
		});
		expect(mockInviteRepo.markAsUsedIfUnused).toHaveBeenCalledWith(
			invite.id.toString(),
			expect.any(Date),
		);
		expect(mockSignInUseCase.execute).toHaveBeenCalledWith({
			email: user.email,
			password: "newpassword123",
			type: "company",
		});
	});

	it("should return error when invite is not found", async () => {
		mockInviteRepo.findByToken.mockResolvedValueOnce(null);

		await expect(
			sut.execute({ token: "non-existent-token", password: "newpassword123" }),
		).rejects.toThrow(InviteNotFoundError);

		expect(mockInviteRepo.findByToken).toHaveBeenCalledWith(
			"non-existent-token",
		);
		expect(mockUserRepo.findById).not.toHaveBeenCalled();
		expect(mockHashGenerator.hash).not.toHaveBeenCalled();
	});

	it("should return error when invite is expired", async () => {
		const user = makeUser({
			email: "employee@example.com",
			name: "Test Employee",
			type: "company",
		});

		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() - 1); // 1 dia no passado

		const invite = Invite.create({
			userId: user.id,
			token: "expired-token",
			expiresAt,
		});

		mockInviteRepo.findByToken.mockResolvedValueOnce(invite);

		await expect(
			sut.execute({ token: "expired-token", password: "newpassword123" }),
		).rejects.toThrow(InviteExpiredError);

		expect(mockInviteRepo.findByToken).toHaveBeenCalledWith("expired-token");
		expect(mockUserRepo.findById).not.toHaveBeenCalled();
		expect(mockHashGenerator.hash).not.toHaveBeenCalled();
	});

	it("should return error when invite is already used", async () => {
		const user = makeUser({
			email: "employee@example.com",
			name: "Test Employee",
			type: "company",
		});

		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() + 7);

		const invite = Invite.create({
			userId: user.id,
			token: "used-token",
			expiresAt,
		});
		invite.markAsUsed();

		mockInviteRepo.findByToken.mockResolvedValueOnce(invite);

		await expect(
			sut.execute({ token: "used-token", password: "newpassword123" }),
		).rejects.toThrow(InviteAlreadyUsedError);

		expect(mockInviteRepo.findByToken).toHaveBeenCalledWith("used-token");
		expect(mockUserRepo.findById).not.toHaveBeenCalled();
		expect(mockHashGenerator.hash).not.toHaveBeenCalled();
	});

	it("should return error when user is not found", async () => {
		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() + 7);

		const invite = Invite.create({
			userId: new UniqueEntityID(), // ID que não existe
			token: "orphan-token",
			expiresAt,
		});

		mockInviteRepo.findByToken.mockResolvedValueOnce(invite);
		mockUserRepo.findById.mockResolvedValueOnce(null);

		await expect(
			sut.execute({ token: "orphan-token", password: "newpassword123" }),
		).rejects.toThrow(ResourceNotFoundError);

		expect(mockInviteRepo.findByToken).toHaveBeenCalledWith("orphan-token");
		expect(mockUserRepo.findById).toHaveBeenCalledWith(
			invite.userId.toString(),
		);
		expect(mockHashGenerator.hash).not.toHaveBeenCalled();
	});

	it("should return error when invite is used concurrently", async () => {
		const user = makeUser({
			email: "employee@example.com",
			name: "Test Employee",
			type: "company",
		});

		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() + 7);

		const invite = Invite.create({
			userId: user.id,
			token: "valid-token",
			expiresAt,
		});

		const hashedPassword = "hashed-password";

		mockInviteRepo.findByToken.mockResolvedValueOnce(invite);
		mockUserRepo.findById.mockResolvedValueOnce(user);
		mockHashGenerator.hash.mockResolvedValueOnce(hashedPassword);
		mockUserRepo.update.mockResolvedValueOnce(undefined);
		mockInviteRepo.markAsUsedIfUnused.mockResolvedValueOnce(false);

		await expect(
			sut.execute({ token: "valid-token", password: "newpassword123" }),
		).rejects.toThrow(InviteAlreadyUsedError);

		expect(mockInviteRepo.markAsUsedIfUnused).toHaveBeenCalledWith(
			invite.id.toString(),
			expect.any(Date),
		);
	});

	it("should generate access token with correct payload", async () => {
		const user = makeUser({
			email: "employee@example.com",
			name: "Test Employee",
			type: "company",
		});

		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() + 7);

		const invite = Invite.create({
			userId: user.id,
			token: "valid-token",
			expiresAt,
		});

		const hashedPassword = "hashed-password";
		const signInResult = {
			id: user.id,
			name: user.name,
			email: user.email,
			type: user.type,
			password: user.password,
			avatar: user.avatar,
			accessToken: "access-token-with-payload",
			staffRole: "admin",
			companyId: "company-id",
		};

		mockInviteRepo.findByToken.mockResolvedValueOnce(invite);
		mockUserRepo.findById.mockResolvedValueOnce(user);
		mockHashGenerator.hash.mockResolvedValueOnce(hashedPassword);
		mockUserRepo.update.mockResolvedValueOnce(undefined);
		mockInviteRepo.markAsUsedIfUnused.mockResolvedValueOnce(true);
		mockSignInUseCase.execute.mockResolvedValueOnce(right(signInResult));

		const result = await sut.execute({
			token: "valid-token",
			password: "newpassword123",
		});

		expect(result.isRight()).toBe(true);

		if (result.isRight()) {
			const { accessToken } = result.value;
			expect(accessToken).toBe("access-token-with-payload");
		}

		expect(mockSignInUseCase.execute).toHaveBeenCalledWith({
			email: user.email,
			password: "newpassword123",
			type: "company",
		});
	});
});
