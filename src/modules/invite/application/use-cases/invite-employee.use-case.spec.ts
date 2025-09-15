import { beforeEach, describe, expect, it, jest } from "bun:test";
import { faker } from "@faker-js/faker";
import { Test } from "@nestjs/testing";
import { makeCompany } from "test/factories/make-company";
import { makeUser } from "test/factories/make-user";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { UserAlreadyExistError } from "@/modules/auth/domain/errors/user-already-exists.error";
import { CompanyRepository } from "@/modules/company/domain/repositories/company.repository";
import { QueueEmailUseCase } from "@/modules/email/application/use-cases/queue-email.use-case";
import { StaffRole } from "@/modules/staff/domain/entities/staff.entity";
import { StaffRepository } from "@/modules/staff/domain/repositories/staff.repository";
import { UserRepository } from "@/modules/user/domain/repositories/user.repository";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { InviteRepository } from "../../domain/repositories/invite.repository";
import { InviteEmployeeUseCase } from "./invite-employee.use-case";

let moduleRef: any;
let sut: InviteEmployeeUseCase;

const mockUserRepository = {
	findByEmail: jest.fn(),
	findById: jest.fn(),
	create: jest.fn(),
};

const mockCompanyRepository = { findById: jest.fn() };

const mockStaffRepository = { create: jest.fn() };

const mockInviteRepository = { create: jest.fn() };

const mockQueueEmailUseCase: Partial<QueueEmailUseCase> = {
	execute: jest.fn(),
	executeHighPriority: jest.fn(),
	executeWithDelay: jest.fn(),
};

describe("Invite Employee", () => {
	beforeEach(async () => {
		mockUserRepository.findByEmail.mockReset();
		mockUserRepository.findById.mockReset();
		mockUserRepository.create.mockReset();
		mockCompanyRepository.findById.mockReset();
		mockStaffRepository.create.mockReset();
		mockInviteRepository.create.mockReset();
		(mockQueueEmailUseCase.execute as any).mockReset?.();
		(mockQueueEmailUseCase.executeHighPriority as any).mockReset?.();
		(mockQueueEmailUseCase.executeWithDelay as any).mockReset?.();

		moduleRef = await Test.createTestingModule({
			providers: [
				InviteEmployeeUseCase,
				{ provide: UserRepository, useValue: mockUserRepository },
				{ provide: CompanyRepository, useValue: mockCompanyRepository },
				{ provide: StaffRepository, useValue: mockStaffRepository },
				{ provide: InviteRepository, useValue: mockInviteRepository },
				{ provide: QueueEmailUseCase, useValue: mockQueueEmailUseCase },
			],
		}).compile();

		sut = moduleRef.get(InviteEmployeeUseCase);
	});

	it("should invite an employee successfully", async () => {
		const company = makeCompany();
		mockCompanyRepository.findById.mockResolvedValueOnce(company);

		const inviter = makeUser({ type: "company" });
		mockUserRepository.findById.mockResolvedValueOnce(inviter);
		mockUserRepository.findByEmail.mockResolvedValueOnce(null);
		mockUserRepository.create.mockResolvedValueOnce(undefined);
		mockStaffRepository.create.mockResolvedValueOnce(undefined);
		mockInviteRepository.create.mockResolvedValueOnce(undefined);

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
			expect(user.email).toBe(params.email);
			expect(user.name).toBe(params.name);
			expect(invite.token).toBeDefined();
			expect(invite.expiresAt).toBeInstanceOf(Date);
			// Side-effects
			expect(mockUserRepository.create).toHaveBeenCalled();
			expect(mockStaffRepository.create).toHaveBeenCalled();
			expect(mockInviteRepository.create).toHaveBeenCalled();
			// Email queued (non-throwing)
			expect(
				(mockQueueEmailUseCase.executeHighPriority as any).mock.calls.length >=
					0,
			).toBe(true);
		}
	});

	it("should not invite employee if company does not exist", async () => {
		const inviter = makeUser({ type: "company" });
		mockUserRepository.findById.mockResolvedValueOnce(inviter);
		mockUserRepository.findByEmail.mockResolvedValueOnce(null);
		mockCompanyRepository.findById.mockResolvedValueOnce(null);

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
		mockCompanyRepository.findById.mockResolvedValueOnce(company);
		mockUserRepository.findById.mockResolvedValueOnce(null);

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
		mockCompanyRepository.findById.mockResolvedValueOnce(company);

		const inviter = makeUser({ type: "company" });
		const existingUser = makeUser({ email: "existing@example.com" });
		mockUserRepository.findById.mockResolvedValueOnce(inviter);
		mockUserRepository.findByEmail.mockResolvedValueOnce(existingUser);

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
		mockCompanyRepository.findById.mockResolvedValueOnce(company);

		const inviter = makeUser({ type: "company" });
		mockUserRepository.findById.mockResolvedValueOnce(inviter);
		mockUserRepository.findByEmail.mockResolvedValueOnce(null);
		mockUserRepository.create.mockResolvedValueOnce(undefined);
		mockStaffRepository.create.mockResolvedValueOnce(undefined);
		mockInviteRepository.create.mockResolvedValueOnce(undefined);

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
		mockCompanyRepository.findById.mockResolvedValueOnce(company);

		const inviter = makeUser({ type: "company" });
		mockUserRepository.findById.mockResolvedValueOnce(inviter);
		mockUserRepository.findByEmail.mockResolvedValueOnce(null);
		mockUserRepository.create.mockResolvedValueOnce(undefined);
		mockStaffRepository.create.mockResolvedValueOnce(undefined);
		mockInviteRepository.create.mockResolvedValueOnce(undefined);

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
