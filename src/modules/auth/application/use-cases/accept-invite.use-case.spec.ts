import { beforeEach, describe, expect, it } from "bun:test";
import { FakeEncrypter } from "test/cryptography/fake-encrypter";
import { FakeHasher } from "test/cryptography/fake-hasher";
import { makeUser } from "test/factories/make-user";
import { InMemoryInviteRepository } from "test/repositories/in-memory-invite.repository";
import { InMemoryUserRepository } from "test/repositories/in-memory-user.repository";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { Invite } from "@/modules/invite/domain/entities/invite.entity";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { AcceptInviteUseCase } from "./accept-invite.use-case";

let inMemoryInviteRepository: InMemoryInviteRepository;
let inMemoryUserRepository: InMemoryUserRepository;
let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let sut: AcceptInviteUseCase;

describe("Accept Invite", () => {
	beforeEach(() => {
		inMemoryInviteRepository = new InMemoryInviteRepository();
		inMemoryUserRepository = new InMemoryUserRepository();
		fakeHasher = new FakeHasher();
		fakeEncrypter = new FakeEncrypter();

		sut = new AcceptInviteUseCase(
			inMemoryInviteRepository,
			inMemoryUserRepository,
			fakeHasher,
			fakeEncrypter,
		);
	});

	it("should accept invite successfully", async () => {
		// Criar usuário
		const user = makeUser({
			email: "employee@example.com",
			name: "Test Employee",
			type: "company",
		});
		await inMemoryUserRepository.items.push(user);

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
			const { user: returnedUser, accessToken } = result.value;

			// Verificar se o usuário foi retornado
			expect(returnedUser.email).toBe("employee@example.com");
			expect(returnedUser.name).toBe("Test Employee");
			expect(accessToken).toBeDefined();

			// Verificar se a senha foi atualizada (FakeHasher adiciona "-hashed")
			expect(returnedUser.password).toContain("newpassword123-hashed");

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
		// Criar usuário
		const user = makeUser({
			email: "employee@example.com",
			type: "company",
		});
		await inMemoryUserRepository.items.push(user);

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
		// Criar usuário
		const user = makeUser({
			email: "employee@example.com",
			type: "company",
		});
		await inMemoryUserRepository.items.push(user);

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
		// Criar usuário
		const user = makeUser({
			email: "employee@example.com",
			name: "Test Employee",
			type: "company",
		});
		await inMemoryUserRepository.items.push(user);

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
