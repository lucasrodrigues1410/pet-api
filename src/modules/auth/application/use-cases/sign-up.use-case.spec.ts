import { beforeEach, describe, expect, it, jest } from "bun:test";
import { CommandBus } from "@nestjs/cqrs";
import { Test } from "@nestjs/testing";
import { UserRepository } from "@/modules/user/domain/repositories/user.repository";
import { HashGenerator } from "../../domain/interfaces/hash-generator.interface";
import { SignUpUseCase } from "./sign-up.use-case";

describe("SignUpUseCase", () => {
	let moduleRef: any;
	let sut: SignUpUseCase;

	const mockUserRepo = {
		findByEmail: jest.fn(),
		findById: jest.fn(),
		create: jest.fn(),
		update: jest.fn(),
		delete: jest.fn(),
	};

	const mockHashGenerator = { hash: jest.fn() };

	const mockCommandBus = { execute: jest.fn() };

	beforeEach(async () => {
		mockUserRepo.findByEmail.mockReset();
		mockUserRepo.findById.mockReset();
		mockUserRepo.create.mockReset();
		mockUserRepo.update.mockReset();
		mockUserRepo.delete.mockReset();
		mockHashGenerator.hash.mockReset();
		mockCommandBus.execute.mockReset();

		moduleRef = await Test.createTestingModule({
			providers: [
				SignUpUseCase,
				{ provide: UserRepository, useValue: mockUserRepo },
				{ provide: HashGenerator, useValue: mockHashGenerator },
				{ provide: CommandBus, useValue: mockCommandBus },
			],
		}).compile();

		sut = moduleRef.get(SignUpUseCase);
	});

	it("should sign up a user", async () => {
		const hashedPassword = "hashed-password";

		mockUserRepo.findByEmail.mockResolvedValueOnce(null); // No existing user
		mockHashGenerator.hash.mockResolvedValueOnce(hashedPassword);
		mockUserRepo.create.mockResolvedValueOnce(undefined);
		mockCommandBus.execute.mockResolvedValueOnce(undefined);

		const result = await sut.execute({
			name: "John Doe",
			email: "johndoe@example.com",
			password: "123456",
		});

		expect(result.isRight()).toBe(true);
		expect(result.value).toEqual({
			user: expect.objectContaining({
				name: "John Doe",
				email: "johndoe@example.com",
				type: "customer",
			}),
		});
		expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(
			"johndoe@example.com",
		);
		expect(mockHashGenerator.hash).toHaveBeenCalledWith("123456");
		expect(mockUserRepo.create).toHaveBeenCalledWith(
			expect.objectContaining({
				name: "John Doe",
				email: "johndoe@example.com",
				type: "customer",
			}),
		);
		expect(mockCommandBus.execute).toHaveBeenCalled();
	});
});
