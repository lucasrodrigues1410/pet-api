import { beforeEach, describe, expect, it, jest } from "bun:test";
import { Test } from "@nestjs/testing";
import { makeStaff } from "test/factories/make-staff";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { StaffRepository } from "../../domain/repositories/staff.repository";
import { GetStaffByUserIdUseCase } from "./get-staff-by-user-id.use-case";

let mockStaffRepository: {
	findByUserId: ReturnType<typeof jest.fn>;
};
let sut: GetStaffByUserIdUseCase;
let moduleRef: any;

describe("Get Staff By User ID Use Case", () => {
	beforeEach(async () => {
		mockStaffRepository = {
			findByUserId: jest.fn(async () => null),
		};

		moduleRef = await Test.createTestingModule({
			providers: [
				GetStaffByUserIdUseCase,
				{ provide: StaffRepository, useValue: mockStaffRepository },
			],
		}).compile();

		sut = moduleRef.get(GetStaffByUserIdUseCase);
	});

	it("should get staff by user id successfully", async () => {
		const userId = new UniqueEntityID();
		const staff = makeStaff({ userId });
		mockStaffRepository.findByUserId.mockResolvedValueOnce(staff);

		const result = await sut.execute(userId.toString());

		expect(result.isRight()).toBe(true);
		if (result.isRight()) {
			expect(result.value).toEqual(staff);
			expect(result.value.userId.toString()).toBe(userId.toString());
		}
		expect(mockStaffRepository.findByUserId).toHaveBeenCalledWith(
			userId.toString(),
		);
	});

	it("should return error when staff is not found", async () => {
		mockStaffRepository.findByUserId.mockResolvedValueOnce(null);

		const result = await sut.execute("non-existent-user-id");

		expect(result.isLeft()).toBe(true);
		if (result.isLeft()) {
			expect(result.value.message).toBe(
				"Staff member not found for the given user ID",
			);
		}
		expect(mockStaffRepository.findByUserId).toHaveBeenCalledWith(
			"non-existent-user-id",
		);
	});

	it("should get staff with admin role", async () => {
		const userId = new UniqueEntityID();
		const staff = makeStaff({ userId, role: "admin" });
		mockStaffRepository.findByUserId.mockResolvedValueOnce(staff);

		const result = await sut.execute(userId.toString());

		expect(result.isRight()).toBe(true);
		if (result.isRight()) {
			expect(result.value.role).toBe("admin");
		}
	});

	it("should get staff with member role", async () => {
		const userId = new UniqueEntityID();
		const staff = makeStaff({ userId, role: "member" });
		mockStaffRepository.findByUserId.mockResolvedValueOnce(staff);

		const result = await sut.execute(userId.toString());

		expect(result.isRight()).toBe(true);
		if (result.isRight()) {
			expect(result.value.role).toBe("member");
		}
	});

	it("should get staff with correct company association", async () => {
		const userId = new UniqueEntityID();
		const companyId = new UniqueEntityID();
		const staff = makeStaff({ userId, companyId });
		mockStaffRepository.findByUserId.mockResolvedValueOnce(staff);

		const result = await sut.execute(userId.toString());

		expect(result.isRight()).toBe(true);
		if (result.isRight()) {
			expect(result.value.companyId.toString()).toBe(companyId.toString());
		}
	});
});
