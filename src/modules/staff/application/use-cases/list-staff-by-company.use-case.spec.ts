import { beforeEach, describe, expect, it, jest } from "bun:test";
import { Test } from "@nestjs/testing";
import { makeStaff } from "test/factories/make-staff";
import { makeUser } from "test/factories/make-user";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { StaffRepository } from "../../domain/repositories/staff.repository";
import { ListStaffByCompanyUseCase } from "./list-staff-by-company.use-case";

let mockStaffRepository: {
	findByUserId: ReturnType<typeof jest.fn>;
	findByCompanyId: ReturnType<typeof jest.fn>;
};
let sut: ListStaffByCompanyUseCase;
let moduleRef: any;

describe("List Staff By Company Use Case", () => {
	beforeEach(async () => {
		mockStaffRepository = {
			findByUserId: jest.fn(async () => null),
			findByCompanyId: jest.fn(async () => ({
				items: [],
				meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
			})),
		};

		moduleRef = await Test.createTestingModule({
			providers: [
				ListStaffByCompanyUseCase,
				{ provide: StaffRepository, useValue: mockStaffRepository },
			],
		}).compile();

		sut = moduleRef.get(ListStaffByCompanyUseCase);
	});

	it("should list all staff members from a company", async () => {
		const companyId = new UniqueEntityID();
		const loggedStaff = makeStaff({ companyId });
		const user1 = makeUser();
		const user2 = makeUser();
		const staff1 = { ...makeStaff({ companyId }), user: user1 };
		const staff2 = { ...makeStaff({ companyId }), user: user2 };

		mockStaffRepository.findByUserId.mockResolvedValueOnce(loggedStaff);
		mockStaffRepository.findByCompanyId.mockResolvedValueOnce({
			items: [staff1, staff2],
			meta: { total: 2, page: 1, limit: 10, totalPages: 1 },
		});

		const result = await sut.execute({
			userId: loggedStaff.userId.toString(),
			query: { page: 1, limit: 10 },
		});

		expect(result.isRight()).toBe(true);
		if (result.isRight()) {
			expect(result.value.items).toHaveLength(2);
			expect(result.value.meta.total).toBe(2);
			expect(result.value.items[0].user).toBeDefined();
			expect(result.value.items[1].user).toBeDefined();
		}
		expect(mockStaffRepository.findByUserId).toHaveBeenCalledWith(
			loggedStaff.userId.toString(),
		);
		expect(mockStaffRepository.findByCompanyId).toHaveBeenCalledWith(
			companyId.toString(),
			{ page: 1, limit: 10 },
		);
	});

	it("should return error when user is not a staff member", async () => {
		mockStaffRepository.findByUserId.mockResolvedValueOnce(null);

		const result = await sut.execute({
			userId: "non-existent-user-id",
			query: { page: 1, limit: 10 },
		});

		expect(result.isLeft()).toBe(true);
		if (result.isLeft()) {
			expect(result.value.message).toBe(
				"Staff not found for the given user ID",
			);
		}
		expect(mockStaffRepository.findByUserId).toHaveBeenCalledWith(
			"non-existent-user-id",
		);
		expect(mockStaffRepository.findByCompanyId).not.toHaveBeenCalled();
	});

	it("should list staff with pagination", async () => {
		const companyId = new UniqueEntityID();
		const loggedStaff = makeStaff({ companyId });
		const user = makeUser();
		const staff = { ...makeStaff({ companyId }), user };

		mockStaffRepository.findByUserId.mockResolvedValueOnce(loggedStaff);
		mockStaffRepository.findByCompanyId.mockResolvedValueOnce({
			items: [staff],
			meta: { total: 10, page: 2, limit: 5, totalPages: 2 },
		});

		const result = await sut.execute({
			userId: loggedStaff.userId.toString(),
			query: { page: 2, limit: 5 },
		});

		expect(result.isRight()).toBe(true);
		if (result.isRight()) {
			expect(result.value.items).toHaveLength(1);
			expect(result.value.meta.total).toBe(10);
		}
		expect(mockStaffRepository.findByCompanyId).toHaveBeenCalledWith(
			companyId.toString(),
			{ page: 2, limit: 5 },
		);
	});

	it("should list staff with query filter", async () => {
		const companyId = new UniqueEntityID();
		const loggedStaff = makeStaff({ companyId });
		const user = makeUser({ name: "John Doe" });
		const staff = { ...makeStaff({ companyId }), user };

		mockStaffRepository.findByUserId.mockResolvedValueOnce(loggedStaff);
		mockStaffRepository.findByCompanyId.mockResolvedValueOnce({
			items: [staff],
			meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
		});

		const result = await sut.execute({
			userId: loggedStaff.userId.toString(),
			query: { page: 1, limit: 10, query: "John" },
		});

		expect(result.isRight()).toBe(true);
		if (result.isRight()) {
			expect(result.value.items).toHaveLength(1);
			expect(result.value.meta.total).toBe(1);
		}
		expect(mockStaffRepository.findByCompanyId).toHaveBeenCalledWith(
			companyId.toString(),
			{ page: 1, limit: 10, query: "John" },
		);
	});

	it("should list staff filtered by admin role", async () => {
		const companyId = new UniqueEntityID();
		const loggedStaff = makeStaff({ companyId });
		const user = makeUser();
		const adminStaff = makeStaff({ companyId, role: "admin" });
		const staffWithUser = Object.assign(adminStaff, { user });

		mockStaffRepository.findByUserId.mockResolvedValueOnce(loggedStaff);
		mockStaffRepository.findByCompanyId.mockResolvedValueOnce({
			items: [staffWithUser],
			meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
		});

		const result = await sut.execute({
			userId: loggedStaff.userId.toString(),
			query: { page: 1, limit: 10, roles: ["admin"] },
		});

		expect(result.isRight()).toBe(true);
		if (result.isRight()) {
			expect(result.value.items).toHaveLength(1);
			expect(result.value.items[0].role).toBe("admin");
		}
		expect(mockStaffRepository.findByCompanyId).toHaveBeenCalledWith(
			companyId.toString(),
			{ page: 1, limit: 10, roles: ["admin"] },
		);
	});

	it("should list staff filtered by member role", async () => {
		const companyId = new UniqueEntityID();
		const loggedStaff = makeStaff({ companyId });
		const user = makeUser();
		const memberStaff = makeStaff({ companyId, role: "member" });
		const staffWithUser = Object.assign(memberStaff, { user });

		mockStaffRepository.findByUserId.mockResolvedValueOnce(loggedStaff);
		mockStaffRepository.findByCompanyId.mockResolvedValueOnce({
			items: [staffWithUser],
			meta: { total: 1, page: 1, limit: 10, totalPages: 1 },
		});

		const result = await sut.execute({
			userId: loggedStaff.userId.toString(),
			query: { page: 1, limit: 10, roles: ["member"] },
		});

		expect(result.isRight()).toBe(true);
		if (result.isRight()) {
			expect(result.value.items).toHaveLength(1);
			expect(result.value.items[0].role).toBe("member");
		}
		expect(mockStaffRepository.findByCompanyId).toHaveBeenCalledWith(
			companyId.toString(),
			{ page: 1, limit: 10, roles: ["member"] },
		);
	});

	it("should list staff filtered by multiple roles", async () => {
		const companyId = new UniqueEntityID();
		const loggedStaff = makeStaff({ companyId });
		const user1 = makeUser();
		const user2 = makeUser();
		const adminStaff = {
			...makeStaff({ companyId, role: "admin" }),
			user: user1,
		};
		const memberStaff = {
			...makeStaff({ companyId, role: "member" }),
			user: user2,
		};

		mockStaffRepository.findByUserId.mockResolvedValueOnce(loggedStaff);
		mockStaffRepository.findByCompanyId.mockResolvedValueOnce({
			items: [adminStaff, memberStaff],
			meta: { total: 2, page: 1, limit: 10, totalPages: 1 },
		});

		const result = await sut.execute({
			userId: loggedStaff.userId.toString(),
			query: { page: 1, limit: 10, roles: ["admin", "member"] },
		});

		expect(result.isRight()).toBe(true);
		if (result.isRight()) {
			expect(result.value.items).toHaveLength(2);
			expect(result.value.meta.total).toBe(2);
		}
		expect(mockStaffRepository.findByCompanyId).toHaveBeenCalledWith(
			companyId.toString(),
			{ page: 1, limit: 10, roles: ["admin", "member"] },
		);
	});

	it("should return empty list when no staff found", async () => {
		const companyId = new UniqueEntityID();
		const loggedStaff = makeStaff({ companyId });

		mockStaffRepository.findByUserId.mockResolvedValueOnce(loggedStaff);
		mockStaffRepository.findByCompanyId.mockResolvedValueOnce({
			items: [],
			meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
		});

		const result = await sut.execute({
			userId: loggedStaff.userId.toString(),
			query: { page: 1, limit: 10 },
		});

		expect(result.isRight()).toBe(true);
		if (result.isRight()) {
			expect(result.value.items).toHaveLength(0);
			expect(result.value.meta.total).toBe(0);
		}
	});
});
