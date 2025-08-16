import { beforeEach, describe, expect, it } from "bun:test";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { makeStaff } from "test/factories/make-staff";
import { makeUser } from "test/factories/make-user";
import { InMemoryStaffRepository } from "test/repositories/in-memory-staff.repository";
import { InMemoryUserRepository } from "test/repositories/in-memory-user.repository";
import { InvalidCredentialsError } from "../../domain/errors/invalid-credentials.error";
import { SignInCompanyUseCase } from "./sign-in-company.use-case";

let inMemoryUserRepository: InMemoryUserRepository;
let inMemoryStaffRepository: InMemoryStaffRepository;
let fakeHasher: FakeHasher;
let encrypter: FakeEncrypter;

let sut: SignInCompanyUseCase;

describe("SignInCompany", () => {
	beforeEach(() => {
		inMemoryUserRepository = new InMemoryUserRepository();
		inMemoryStaffRepository = new InMemoryStaffRepository();
		fakeHasher = new FakeHasher();
		encrypter = new FakeEncrypter();

		sut = new SignInCompanyUseCase(
			inMemoryUserRepository,
			inMemoryStaffRepository,
			fakeHasher,
			encrypter,
		);
	});

	it("should sign in company", async () => {
		const user = makeUser({
			email: "johndoe@example.com",
			password: await fakeHasher.hash("123456"),
			type: "CUSTOMER",
		});
		inMemoryUserRepository.items.push(user);

		const staff = makeStaff({
			userId: user.id,
		});
		inMemoryStaffRepository.items.push(staff);

		const result = await sut.execute({
			email: user.email,
			password: "123456",
		});

		expect(result.isRight()).toBe(true);
		expect(result.value).toEqual(
			expect.objectContaining({
				accessToken: expect.any(String),
			}),
		);
	});

	it("should not sign in company if user is not a company", async () => {
		const user = makeUser({
			email: "johndoe@example.com",
			password: await fakeHasher.hash("123456"),
			type: "CUSTOMER",
		});
		inMemoryUserRepository.items.push(user);

		const result = await sut.execute({
			email: user.email,
			password: "123456",
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(InvalidCredentialsError);
	});
});
