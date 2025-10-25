import { beforeEach, describe, expect, it, jest } from "bun:test";
import { Test } from "@nestjs/testing";
import { makeStaff } from "test/factories/make-staff";
import { makeUser } from "test/factories/make-user";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { AuthProviderService } from "@/modules/auth/domain/interfaces/auth-provider.service.interface";
import { UserRepository } from "@/modules/user/domain/repositories/user.repository";
import { StaffRepository } from "../../domain/repositories/staff.repository";
import { CreateStaffUseCase } from "./create-staff.use-case";

let mockStaffRepository: {
	findByUserId: ReturnType<typeof jest.fn>;
	findByUserEmail: ReturnType<typeof jest.fn>;
	create: ReturnType<typeof jest.fn>;
};
let mockUserRepository: {
	findByEmail: ReturnType<typeof jest.fn>;
	create: ReturnType<typeof jest.fn>;
};
let mockAuthProviderService: {
	inviteUser: ReturnType<typeof jest.fn>;
};
let sut: CreateStaffUseCase;
let moduleRef: any;

describe("Create Staff Use Case", () => {
	beforeEach(async () => {
		mockStaffRepository = {
			findByUserId: jest.fn(async () => null),
			findByUserEmail: jest.fn(async () => null),
			create: jest.fn(async () => undefined),
		};
		mockUserRepository = {
			findByEmail: jest.fn(async () => null),
			create: jest.fn(async () => undefined),
		};
		mockAuthProviderService = {
			inviteUser: jest.fn(async () => undefined),
		};

		moduleRef = await Test.createTestingModule({
			providers: [
				CreateStaffUseCase,
				{ provide: StaffRepository, useValue: mockStaffRepository },
				{ provide: UserRepository, useValue: mockUserRepository },
				{ provide: AuthProviderService, useValue: mockAuthProviderService },
			],
		}).compile();

		sut = moduleRef.get(CreateStaffUseCase);
	});

	it("should create a new staff member with a new user", async () => {
		const loggedStaff = makeStaff({ role: "admin" });
		mockStaffRepository.findByUserId.mockResolvedValueOnce(loggedStaff);
		mockUserRepository.findByEmail.mockResolvedValueOnce(null);

		const result = await sut.execute({
			email: "newstaff@example.com",
			name: "New Staff Member",
			role: "member",
			companyId: loggedStaff.companyId.toString(),
			loggedUserId: loggedStaff.userId.toString(),
		});

		expect(result.isRight()).toBe(true);
		expect(mockStaffRepository.findByUserId).toHaveBeenCalledWith(
			loggedStaff.userId.toString(),
		);
		expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
			"newstaff@example.com",
		);
		expect(mockUserRepository.create).toHaveBeenCalled();
		expect(mockStaffRepository.create).toHaveBeenCalled();
		expect(mockAuthProviderService.inviteUser).toHaveBeenCalledWith(
			"newstaff@example.com",
		);
	});

	it("should create a new staff member with an existing user", async () => {
		const loggedStaff = makeStaff({ role: "admin" });
		const existingUser = makeUser({ email: "existing@example.com" });
		mockStaffRepository.findByUserId.mockResolvedValueOnce(loggedStaff);
		mockUserRepository.findByEmail.mockResolvedValueOnce(existingUser);

		const result = await sut.execute({
			email: "existing@example.com",
			name: "Existing User",
			role: "member",
			companyId: loggedStaff.companyId.toString(),
			loggedUserId: loggedStaff.userId.toString(),
		});

		expect(result.isRight()).toBe(true);
		expect(mockStaffRepository.findByUserId).toHaveBeenCalledWith(
			loggedStaff.userId.toString(),
		);
		expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
			"existing@example.com",
		);
		expect(mockUserRepository.create).not.toHaveBeenCalled();
		expect(mockStaffRepository.create).toHaveBeenCalled();
		expect(mockAuthProviderService.inviteUser).toHaveBeenCalledWith(
			"existing@example.com",
		);
	});

	it("should return error when logged user is not a staff member of the company", async () => {
		const differentCompanyId = new UniqueEntityID();
		const loggedStaff = makeStaff({
			role: "admin",
			companyId: differentCompanyId,
		});
		mockStaffRepository.findByUserId.mockResolvedValueOnce(loggedStaff);

		const result = await sut.execute({
			email: "newstaff@example.com",
			name: "New Staff Member",
			role: "member",
			companyId: new UniqueEntityID().toString(),
			loggedUserId: loggedStaff.userId.toString(),
		});

		expect(result.isLeft()).toBe(true);
		if (result.isLeft()) {
			expect(result.value.message).toBe(
				"Only staff members can create new staff",
			);
		}
		expect(mockStaffRepository.create).not.toHaveBeenCalled();
		expect(mockAuthProviderService.inviteUser).not.toHaveBeenCalled();
	});

	it("should return error when staff with email already exists", async () => {
		const loggedStaff = makeStaff({ role: "admin" });
		const existingStaff = makeStaff({
			companyId: loggedStaff.companyId,
		});
		mockStaffRepository.findByUserId.mockResolvedValueOnce(loggedStaff);
		mockStaffRepository.findByUserEmail.mockResolvedValueOnce(existingStaff);

		const result = await sut.execute({
			email: "existing@example.com",
			name: "Existing Staff",
			role: "member",
			companyId: loggedStaff.companyId.toString(),
			loggedUserId: loggedStaff.userId.toString(),
		});

		expect(result.isLeft()).toBe(true);
		if (result.isLeft()) {
			expect(result.value.message).toBe(
				"Staff with this email already exists",
			);
		}
		expect(mockStaffRepository.findByUserEmail).toHaveBeenCalledWith(
			"existing@example.com",
		);
		expect(mockStaffRepository.create).not.toHaveBeenCalled();
		expect(mockAuthProviderService.inviteUser).not.toHaveBeenCalled();
	});

	it("should create staff with admin role", async () => {
		const loggedStaff = makeStaff({ role: "admin" });
		mockStaffRepository.findByUserId.mockResolvedValueOnce(loggedStaff);
		mockUserRepository.findByEmail.mockResolvedValueOnce(null);

		const result = await sut.execute({
			email: "newadmin@example.com",
			name: "New Admin",
			role: "admin",
			companyId: loggedStaff.companyId.toString(),
			loggedUserId: loggedStaff.userId.toString(),
		});

		expect(result.isRight()).toBe(true);
		expect(mockStaffRepository.create).toHaveBeenCalled();
		const createdStaff = mockStaffRepository.create.mock.calls[0][0];
		expect(createdStaff.role).toBe("admin");
	});

	it("should create staff with member role", async () => {
		const loggedStaff = makeStaff({ role: "admin" });
		mockStaffRepository.findByUserId.mockResolvedValueOnce(loggedStaff);
		mockUserRepository.findByEmail.mockResolvedValueOnce(null);

		const result = await sut.execute({
			email: "newmember@example.com",
			name: "New Member",
			role: "member",
			companyId: loggedStaff.companyId.toString(),
			loggedUserId: loggedStaff.userId.toString(),
		});

		expect(result.isRight()).toBe(true);
		expect(mockStaffRepository.create).toHaveBeenCalled();
		const createdStaff = mockStaffRepository.create.mock.calls[0][0];
		expect(createdStaff.role).toBe("member");
	});
});
