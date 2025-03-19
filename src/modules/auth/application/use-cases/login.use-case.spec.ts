import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { makeUser } from "test/factories/make-user";
import { InMemoryUserRepository } from "test/repositories/in-memory-user.repository";
import { LoginUseCase } from "./login.use-case";

let inMemoryUserRepository: InMemoryUserRepository;
let fakeHasher: FakeHasher;
let encrypter: FakeEncrypter;

let useCase: LoginUseCase;

describe("Login", () => {
	beforeEach(() => {
		inMemoryUserRepository = new InMemoryUserRepository();
		fakeHasher = new FakeHasher();
		encrypter = new FakeEncrypter();

		useCase = new LoginUseCase(inMemoryUserRepository, fakeHasher, encrypter);
	});

	it("should login", async () => {
		const user = makeUser({
			email: "johndoe@example.com",
			password: await fakeHasher.hash("123456"),
		});
		inMemoryUserRepository.users.push(user);
		const result = await useCase.execute({
			email: user.email,
			password: "123456",
		});

		expect(result.isRight()).toBe(true);
		expect(result.value).toEqual({
			accessToken: expect.any(String),
		});
	});
});
