import { beforeEach, describe, expect, it } from "bun:test";
import { faker } from "@faker-js/faker";
import { makeCompany } from "test/factories/make-company";
import { makeUser } from "test/factories/make-user";
import { InMemoryCompanyRepository } from "test/repositories/in-memory-company.repository";
import { InMemoryInviteRepository } from "test/repositories/in-memory-invite.repository";
import { InMemoryStaffRepository } from "test/repositories/in-memory-staff.repository";
import { InMemoryUserRepository } from "test/repositories/in-memory-user.repository";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { UserAlreadyExistError } from "@/modules/auth/domain/errors/user-already-exists.error";
import { QueueEmailUseCase } from "@/modules/email/application/use-cases/queue-email.use-case";
import { StaffRole } from "@/modules/staff/domain/entities/staff.entity";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { InviteEmployeeUseCase } from "./invite-employee.use-case";

let inMemoryUserRepository: InMemoryUserRepository;
let inMemoryCompanyRepository: InMemoryCompanyRepository;
let inMemoryStaffRepository: InMemoryStaffRepository;
let inMemoryInviteRepository: InMemoryInviteRepository;
let mockQueueEmailUseCase: QueueEmailUseCase;

let sut: InviteEmployeeUseCase;

describe("Invite Employee", () => {
	beforeEach(() => {
		inMemoryUserRepository = new InMemoryUserRepository();
		inMemoryCompanyRepository = new InMemoryCompanyRepository();
		inMemoryStaffRepository = new InMemoryStaffRepository();
		inMemoryInviteRepository = new InMemoryInviteRepository();

		// Mock do QueueEmailUseCase
		mockQueueEmailUseCase = {
			execute: async () => {},
			executeHighPriority: async () => {},
			executeWithDelay: async () => {},
		} as unknown as QueueEmailUseCase;

		sut = new InviteEmployeeUseCase(
			inMemoryUserRepository,
			inMemoryCompanyRepository,
			inMemoryStaffRepository,
			inMemoryInviteRepository,
			mockQueueEmailUseCase,
		);
	});

	it("should invite an employee successfully", async () => {
		const company = makeCompany();
		await inMemoryCompanyRepository.items.push(company);

		const inviter = makeUser({ type: "company" });
		await inMemoryUserRepository.items.push(inviter);

		const params = {
			name: faker.person.fullName(),
			email: faker.internet.email(),
			companyId: company.id.toString(),
			inviterUserId: inviter.id.toString(),
			role: "employee" as StaffRole,
		};

		const result = await sut.execute(params);

		expect(result.isRight()).toBe(true);

		if (result.isRight()) {
			const { invite, user } = result.value;

			// Verificar se o usuário foi criado (agora temos 2: o convidador + o novo funcionário)
			expect(inMemoryUserRepository.items).toHaveLength(2);
			const newEmployee = inMemoryUserRepository.items.find(
				(u) => u.email === params.email,
			);
			expect(newEmployee).toBeDefined();
			expect(newEmployee!.name).toBe(params.name);
			expect(newEmployee!.email).toBe(params.email);
			expect(newEmployee!.type).toBe("company");

			// Verificar se o staff foi criado
			expect(inMemoryStaffRepository.items).toHaveLength(1);
			expect(inMemoryStaffRepository.items[0].userId.toString()).toBe(
				user.id.toString(),
			);
			expect(inMemoryStaffRepository.items[0].companyId.toString()).toBe(
				company.id.toString(),
			);
			expect(inMemoryStaffRepository.items[0].role).toBe("employee");

			// Verificar se o convite foi criado
			expect(inMemoryInviteRepository.items).toHaveLength(1);
			expect(inMemoryInviteRepository.items[0].userId.toString()).toBe(
				user.id.toString(),
			);
			expect(invite.token).toBeDefined();
			expect(invite.expiresAt).toBeInstanceOf(Date);
		}
	});

	it("should not invite employee if company does not exist", async () => {
		const inviter = makeUser({ type: "company" });
		await inMemoryUserRepository.items.push(inviter);

		const params = {
			name: faker.person.fullName(),
			email: faker.internet.email(),
			companyId: new UniqueEntityID().toString(),
			inviterUserId: inviter.id.toString(),
			role: "employee" as StaffRole,
		};

		const result = await sut.execute(params);

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});

	it("should not invite employee if inviter does not exist", async () => {
		const company = makeCompany();
		await inMemoryCompanyRepository.items.push(company);

		const params = {
			name: faker.person.fullName(),
			email: faker.internet.email(),
			companyId: company.id.toString(),
			inviterUserId: new UniqueEntityID().toString(),
			role: "employee" as StaffRole,
		};

		const result = await sut.execute(params);

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});

	it("should not invite employee if user already exists with same email", async () => {
		const company = makeCompany();
		await inMemoryCompanyRepository.items.push(company);

		const inviter = makeUser({ type: "company" });
		const existingUser = makeUser({
			email: "existing@example.com",
		});
		await inMemoryUserRepository.items.push(inviter);
		await inMemoryUserRepository.items.push(existingUser);

		const params = {
			name: faker.person.fullName(),
			email: "existing@example.com",
			companyId: company.id.toString(),
			inviterUserId: inviter.id.toString(),
			role: "employee" as StaffRole,
		};

		const result = await sut.execute(params);

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(UserAlreadyExistError);
	});

	it("should create invite with correct expiration date (7 days)", async () => {
		const company = makeCompany();
		await inMemoryCompanyRepository.items.push(company);

		const inviter = makeUser({ type: "company" });
		await inMemoryUserRepository.items.push(inviter);

		const params = {
			name: faker.person.fullName(),
			email: faker.internet.email(),
			companyId: company.id.toString(),
			inviterUserId: inviter.id.toString(),
			role: "employee" as StaffRole,
		};

		const beforeExecution = new Date();
		const result = await sut.execute(params);
		const afterExecution = new Date();

		expect(result.isRight()).toBe(true);

		if (result.isRight()) {
			const { invite } = result.value;
			const expectedMinExpiration = new Date(beforeExecution);
			expectedMinExpiration.setDate(expectedMinExpiration.getDate() + 7);

			const expectedMaxExpiration = new Date(afterExecution);
			expectedMaxExpiration.setDate(expectedMaxExpiration.getDate() + 7);

			expect(invite.expiresAt.getTime()).toBeGreaterThanOrEqual(
				expectedMinExpiration.getTime(),
			);
			expect(invite.expiresAt.getTime()).toBeLessThanOrEqual(
				expectedMaxExpiration.getTime(),
			);
		}
	});

	it("should hash the temporary password", async () => {
		const company = makeCompany();
		await inMemoryCompanyRepository.items.push(company);

		const inviter = makeUser({ type: "company" });
		await inMemoryUserRepository.items.push(inviter);

		const params = {
			name: faker.person.fullName(),
			email: faker.internet.email(),
			companyId: company.id.toString(),
			inviterUserId: inviter.id.toString(),
			role: "employee" as StaffRole,
		};

		const result = await sut.execute(params);

		expect(result.isRight()).toBe(true);
	});
});
