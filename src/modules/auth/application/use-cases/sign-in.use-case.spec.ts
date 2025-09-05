import { beforeEach, describe, expect, it } from "bun:test";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { makeUser } from "test/factories/make-user";
import { InMemoryStaffRepository } from "test/repositories/in-memory-staff.repository";
import { InMemoryUserRepository } from "test/repositories/in-memory-user.repository";
import { InvalidCredentialsError } from "../../domain/errors/invalid-credentials.error";
import { SignInUseCase } from "./sign-in.use-case";

let inMemoryUserRepository: InMemoryUserRepository;
let fakeHasher: FakeHasher;
let encrypter: FakeEncrypter;
let inMemoryStaffRepository: InMemoryStaffRepository;

let sut: SignInUseCase;

describe("SignIn", () => {
	beforeEach(() => {
		inMemoryUserRepository = new InMemoryUserRepository();
		fakeHasher = new FakeHasher();
		encrypter = new FakeEncrypter();
		inMemoryStaffRepository = new InMemoryStaffRepository();

		sut = new SignInUseCase(
			inMemoryUserRepository,
			inMemoryStaffRepository,
			fakeHasher,
			encrypter,
		);
	});

	it("should sign in", async () => {
		const user = makeUser({
			email: "johndoe@example.com",
			password: await fakeHasher.hash("123456"),
			type: "customer",
		});
		inMemoryUserRepository.items.push(user);
		const result = await sut.execute({
			email: user.email,
			password: "123456",
			type: "customer",
		});

		expect(result.isRight()).toBe(true);
		expect(result.value).toEqual(
			expect.objectContaining({
				accessToken: expect.any(String),
			}),
		);
	});

	it("should not sign in if user is not a customer", async () => {
		const user = makeUser({
			email: "johndoe@example.com",
			password: await fakeHasher.hash("123456"),
			type: "company",
		});
		inMemoryUserRepository.items.push(user);
		const result = await sut.execute({
			email: user.email,
			password: "123456",
			type: "company",
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(InvalidCredentialsError);
	});
});
