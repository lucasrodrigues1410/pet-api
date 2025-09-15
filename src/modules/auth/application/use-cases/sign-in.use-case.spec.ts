import { beforeEach, describe, expect, it, jest } from "bun:test";
import { Test } from "@nestjs/testing";
import { makeUser } from "test/factories/make-user";
import { StaffRepository } from "@/modules/staff/domain/repositories/staff.repository";
import { UserRepository } from "@/modules/user/domain/repositories/user.repository";
import { InvalidCredentialsError } from "../../domain/errors/invalid-credentials.error";
import { Encrypter } from "../../domain/interfaces/encrypter.interface";
import { HashComparer } from "../../domain/interfaces/hash-comparer.interface";
import { SignInUseCase } from "./sign-in.use-case";

describe("SignInUseCase", () => {
	let moduleRef: any;
	let sut: SignInUseCase;

	const mockUserRepo = {
		findByEmail: jest.fn(),
		findById: jest.fn(),
		create: jest.fn(),
		update: jest.fn(),
		delete: jest.fn(),
	};

	const mockStaffRepo = {
		findByUserId: jest.fn(),
		create: jest.fn(),
		update: jest.fn(),
		delete: jest.fn(),
	};

	const mockHashComparer = { compare: jest.fn() };

	const mockEncrypter = { encrypt: jest.fn() };

	beforeEach(async () => {
		mockUserRepo.findByEmail.mockReset();
		mockUserRepo.findById.mockReset();
		mockUserRepo.create.mockReset();
		mockUserRepo.update.mockReset();
		mockUserRepo.delete.mockReset();
		mockStaffRepo.findByUserId.mockReset();
		mockStaffRepo.create.mockReset();
		mockStaffRepo.update.mockReset();
		mockStaffRepo.delete.mockReset();
		mockHashComparer.compare.mockReset();
		mockEncrypter.encrypt.mockReset();

		moduleRef = await Test.createTestingModule({
			providers: [
				SignInUseCase,
				{ provide: UserRepository, useValue: mockUserRepo },
				{ provide: StaffRepository, useValue: mockStaffRepo },
				{ provide: HashComparer, useValue: mockHashComparer },
				{ provide: Encrypter, useValue: mockEncrypter },
			],
		}).compile();

		sut = moduleRef.get(SignInUseCase);
	});

	it("should sign in", async () => {
		const user = makeUser({
			email: "johndoe@example.com",
			password: "hashed-password",
			type: "customer",
		});

		mockUserRepo.findByEmail.mockResolvedValueOnce(user);
		mockHashComparer.compare.mockResolvedValueOnce(true);
		mockEncrypter.encrypt.mockResolvedValueOnce("access-token");

		const result = await sut.execute({
			email: user.email,
			password: "123456",
			type: "customer",
		});

		expect(result.isRight()).toBe(true);
		expect(result.value).toEqual(
			expect.objectContaining({ accessToken: "access-token" }),
		);
		expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(user.email);
		expect(mockHashComparer.compare).toHaveBeenCalledWith(
			"123456",
			user.password,
		);
		expect(mockEncrypter.encrypt).toHaveBeenCalledWith({
			sub: user.id.toString(),
			name: user.name,
			email: user.email,
			type: user.type,
			role: undefined,
			companyId: undefined,
			avatar: user.avatar?.url,
		});
	});

	it("should not sign in if user is not a customer", async () => {
		const user = makeUser({
			email: "johndoe@example.com",
			password: "hashed-password",
			type: "company",
		});

		mockUserRepo.findByEmail.mockResolvedValueOnce(user);
		mockHashComparer.compare.mockResolvedValueOnce(true);

		const result = await sut.execute({
			email: user.email,
			password: "123456",
			type: "customer", // Different type than user
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(InvalidCredentialsError);
		expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(user.email);
		expect(mockHashComparer.compare).toHaveBeenCalledWith(
			"123456",
			user.password,
		);
		expect(mockEncrypter.encrypt).not.toHaveBeenCalled();
	});
});
