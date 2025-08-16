import { beforeEach, describe, expect, it } from "bun:test";
import { CommandBus } from "@nestjs/cqrs";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { InMemoryUserRepository } from "test/repositories/in-memory-user.repository";
import { SignUpUseCase } from "./sign-up.use-case";

let inMemoryUsersRepository: InMemoryUserRepository;
let commandBus: CommandBus;
let fakeHasher: FakeHasher;

let sut: SignUpUseCase;

describe("SignUp", () => {
	beforeEach(() => {
		inMemoryUsersRepository = new InMemoryUserRepository();
		fakeHasher = new FakeHasher();
		commandBus = {
			execute: async () => {},
		} as unknown as CommandBus;
		sut = new SignUpUseCase(inMemoryUsersRepository, fakeHasher, commandBus);
	});

	it("should sign up a user", async () => {
		const result = await sut.execute({
			name: "John Doe",
			email: "johndoe@example.com",
			password: "123456",
		});

		expect(result.isRight()).toBe(true);
		expect(result.value).toEqual({
			user: inMemoryUsersRepository.items[0],
		});
	});
});
