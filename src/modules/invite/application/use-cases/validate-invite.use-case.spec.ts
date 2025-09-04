import { beforeEach, describe, expect, it } from "bun:test";
import { InMemoryInviteRepository } from "test/repositories/in-memory-invite.repository";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { Invite } from "../../domain/entities/invite.entity";
import { ValidateInviteUseCase } from "./validate-invite.use-case";

let inMemoryInviteRepository: InMemoryInviteRepository;
let sut: ValidateInviteUseCase;

describe("Validate Invite", () => {
	beforeEach(() => {
		inMemoryInviteRepository = new InMemoryInviteRepository();
		sut = new ValidateInviteUseCase(inMemoryInviteRepository);
	});

	it("should validate a valid invite successfully", async () => {
		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() + 7); // 7 dias no futuro

		const invite = Invite.create({
			userId: new UniqueEntityID(),
			token: "valid-token",
			expiresAt,
		});

		await inMemoryInviteRepository.items.push(invite);

		const result = await sut.execute({ token: "valid-token" });

		expect(result.isRight()).toBe(true);

		if (result.isRight()) {
			const {
				invite: returnedInvite,
				isValid,
				isExpired,
				isUsed,
			} = result.value;

			expect(isValid).toBe(true);
			expect(isExpired).toBe(false);
			expect(isUsed).toBe(false);
			expect(returnedInvite.token).toBe("valid-token");
		}
	});

	it("should return error when invite is not found", async () => {
		const result = await sut.execute({ token: "non-existent-token" });

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});

	it("should detect expired invite", async () => {
		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() - 1); // 1 dia no passado

		const invite = Invite.create({
			userId: new UniqueEntityID(),
			token: "expired-token",
			expiresAt,
		});

		await inMemoryInviteRepository.items.push(invite);

		const result = await sut.execute({ token: "expired-token" });

		expect(result.isRight()).toBe(true);

		if (result.isRight()) {
			const { isValid, isExpired, isUsed } = result.value;

			expect(isValid).toBe(false);
			expect(isExpired).toBe(true);
			expect(isUsed).toBe(false);
		}
	});

	it("should detect used invite", async () => {
		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() + 7); // 7 dias no futuro

		const invite = Invite.create({
			userId: new UniqueEntityID(),
			token: "used-token",
			expiresAt,
		});

		// Marcar como usado
		invite.markAsUsed();
		await inMemoryInviteRepository.items.push(invite);

		const result = await sut.execute({ token: "used-token" });

		expect(result.isRight()).toBe(true);

		if (result.isRight()) {
			const { isValid, isExpired, isUsed } = result.value;

			expect(isValid).toBe(false);
			expect(isExpired).toBe(false);
			expect(isUsed).toBe(true);
		}
	});

	it("should detect expired and used invite", async () => {
		const expiresAt = new Date();
		expiresAt.setDate(expiresAt.getDate() - 1); // 1 dia no passado

		const invite = Invite.create({
			userId: new UniqueEntityID(),
			token: "expired-used-token",
			expiresAt,
		});

		// Marcar como usado
		invite.markAsUsed();
		await inMemoryInviteRepository.items.push(invite);

		const result = await sut.execute({ token: "expired-used-token" });

		expect(result.isRight()).toBe(true);

		if (result.isRight()) {
			const { isValid, isExpired, isUsed } = result.value;

			expect(isValid).toBe(false);
			expect(isExpired).toBe(true);
			expect(isUsed).toBe(true);
		}
	});
});
