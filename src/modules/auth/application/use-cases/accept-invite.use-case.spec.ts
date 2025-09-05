import { beforeEach, describe, expect, it } from "bun:test";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { makeStaff } from "test/factories/make-staff";
import { makeUser } from "test/factories/make-user";
import { InMemoryInviteRepository } from "test/repositories/in-memory-invite.repository";
import { InMemoryStaffRepository } from "test/repositories/in-memory-staff.repository";
import { InMemoryUserRepository } from "test/repositories/in-memory-user.repository";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { Invite } from "@/modules/invite/domain/entities/invite.entity";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { AcceptInviteUseCase } from "./accept-invite.use-case";
import { SignInUseCase } from "./sign-in.use-case";

let inMemoryInviteRepository: InMemoryInviteRepository;
let signInUseCase: SignInUseCase;
let inMemoryUserRepository: InMemoryUserRepository;
let inMemoryStaffRepository: InMemoryStaffRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let sut: AcceptInviteUseCase;

describe("Accept Invite", () => {
	const user = makeUser({
		email: "employee@example.com",
		name: "Test Employee",
		type: "company",
	});
	const staff = makeStaff({ userId: user.id });

	beforeEach(() => {
		inMemoryInviteRepository = new InMemoryInviteRepository();
		inMemoryUserRepository = new InMemoryUserRepository();
		inMemoryStaffRepository = new InMemoryStaffRepository();
		fakeHasher = new FakeHasher();
		fakeEncrypter = new FakeEncrypter();
		signInUseCase = new SignInUseCase(
			inMemoryUserRepository,
			inMemoryStaffRepository,
			fakeHasher,
			fakeEncrypter,
		);

		inMemoryUserRepository.items.push(user);
		inMemoryStaffRepository.items.push(staff);

		sut = new AcceptInviteUseCase(
			inMemoryInviteRepository,
			signInUseCase,
			inMemoryUserRepository,
			fakeHasher,
		);
	});

	it("should accept invite successfully", async () => {
		// Criar convite válido
		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() + 7);

		const invite = Invite.create({
			userId: user.id,
			token: "valid-token",
			expiresAt,
		});
		await inMemoryInviteRepository.items.push(invite);

		const result = await sut.execute({
			token: "valid-token",
			password: "newpassword123",
		});

		expect(result.isRight()).toBe(true);

		if (result.isRight()) {
			const { name, email, password, accessToken } = result.value;

			// Verificar se o usuário foi retornado
			expect(email).toBe("employee@example.com");
			expect(name).toBe("Test Employee");
			expect(accessToken).toBeDefined();

			// Verificar se a senha foi atualizada (FakeHasher adiciona "-hashed")
			expect(password).toContain("newpassword123-hashed");

			// Verificar se o convite foi marcado como usado
			const updatedInvite = inMemoryInviteRepository.items.find(
				(i) => i.token === "valid-token",
			);
			expect(updatedInvite?.usedAt).toBeDefined();
		}
	});

	it("should return error when invite is not found", async () => {
		const result = await sut.execute({
			token: "non-existent-token",
			password: "newpassword123",
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});

	it("should return error when invite is expired", async () => {
		// Criar convite expirado
		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() - 1); // 1 dia no passado

		const invite = Invite.create({
			userId: user.id,
			token: "expired-token",
			expiresAt,
		});
		await inMemoryInviteRepository.items.push(invite);

		const result = await sut.execute({
			token: "expired-token",
			password: "newpassword123",
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});

	it("should return error when invite is already used", async () => {
		// Criar convite já usado
		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() + 7);

		const invite = Invite.create({
			userId: user.id,
			token: "used-token",
			expiresAt,
		});
		invite.markAsUsed();
		await inMemoryInviteRepository.items.push(invite);

		const result = await sut.execute({
			token: "used-token",
			password: "newpassword123",
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});

	it("should return error when user is not found", async () => {
		// Criar convite sem usuário associado
		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() + 7);

		const invite = Invite.create({
			userId: new UniqueEntityID(), // ID que não existe
			token: "orphan-token",
			expiresAt,
		});
		await inMemoryInviteRepository.items.push(invite);

		const result = await sut.execute({
			token: "orphan-token",
			password: "newpassword123",
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});

	it("should generate access token with correct payload", async () => {
		// Criar convite válido
		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() + 7);

		const invite = Invite.create({
			userId: user.id,
			token: "valid-token",
			expiresAt,
		});
		await inMemoryInviteRepository.items.push(invite);

		const result = await sut.execute({
			token: "valid-token",
			password: "newpassword123",
		});

		expect(result.isRight()).toBe(true);

		if (result.isRight()) {
			const { accessToken } = result.value;

			// FakeEncrypter retorna um token com o payload
			expect(accessToken).toContain(user.id.toString());
			expect(accessToken).toContain("Test Employee");
			expect(accessToken).toContain("employee@example.com");
			expect(accessToken).toContain("company");
		}
	});
});
