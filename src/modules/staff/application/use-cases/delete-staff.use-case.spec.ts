import { beforeEach, describe, expect, it, jest } from "bun:test";
import { Test } from "@nestjs/testing";
import { makeStaff } from "test/factories/make-staff";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { StaffRepository } from "../../domain/repositories/staff.repository";
import { DeleteStaffUseCase } from "./delete-staff.use-case";

let mockStaffRepository: {
	findById: ReturnType<typeof jest.fn>;
	delete: ReturnType<typeof jest.fn>;
};
let sut: DeleteStaffUseCase;
let moduleRef: any;

describe("Delete Staff Use Case", () => {
	beforeEach(async () => {
		mockStaffRepository = {
			findById: jest.fn(async () => null),
			delete: jest.fn(async () => undefined),
		};

		moduleRef = await Test.createTestingModule({
			providers: [
				DeleteStaffUseCase,
				{ provide: StaffRepository, useValue: mockStaffRepository },
			],
		}).compile();

		sut = moduleRef.get(DeleteStaffUseCase);
	});

	it("should delete a staff member successfully", async () => {
		const companyId = new UniqueEntityID();
		const staff = makeStaff({ companyId });
		mockStaffRepository.findById.mockResolvedValueOnce(staff);

		const result = await sut.execute({
			id: staff.id.toString(),
			companyId: companyId.toString(),
		});

		expect(result.isRight()).toBe(true);
		expect(mockStaffRepository.findById).toHaveBeenCalledWith(
			staff.id.toString(),
		);
		expect(mockStaffRepository.delete).toHaveBeenCalledWith(
			staff.id.toString(),
		);
	});

	it("should return error when staff does not exist", async () => {
		mockStaffRepository.findById.mockResolvedValueOnce(null);

		const result = await sut.execute({
			id: "non-existent-id",
			companyId: "company-id",
		});

		expect(result.isLeft()).toBe(true);
		if (result.isLeft()) {
			expect(result.value.message).toBe("Recurso não encontrado");
		}
		expect(mockStaffRepository.findById).toHaveBeenCalledWith(
			"non-existent-id",
		);
		expect(mockStaffRepository.delete).not.toHaveBeenCalled();
	});

	it("should return error when staff belongs to a different company", async () => {
		const staffCompanyId = new UniqueEntityID();
		const differentCompanyId = new UniqueEntityID();
		const staff = makeStaff({ companyId: staffCompanyId });
		mockStaffRepository.findById.mockResolvedValueOnce(staff);

		const result = await sut.execute({
			id: staff.id.toString(),
			companyId: differentCompanyId.toString(),
		});

		expect(result.isLeft()).toBe(true);
		if (result.isLeft()) {
			expect(result.value.message).toBe("Recurso não encontrado");
		}
		expect(mockStaffRepository.findById).toHaveBeenCalledWith(
			staff.id.toString(),
		);
		expect(mockStaffRepository.delete).not.toHaveBeenCalled();
	});

	it("should delete staff with admin role", async () => {
		const companyId = new UniqueEntityID();
		const staff = makeStaff({ companyId, role: "admin" });
		mockStaffRepository.findById.mockResolvedValueOnce(staff);

		const result = await sut.execute({
			id: staff.id.toString(),
			companyId: companyId.toString(),
		});

		expect(result.isRight()).toBe(true);
		expect(mockStaffRepository.delete).toHaveBeenCalledWith(
			staff.id.toString(),
		);
	});

	it("should delete staff with member role", async () => {
		const companyId = new UniqueEntityID();
		const staff = makeStaff({ companyId, role: "member" });
		mockStaffRepository.findById.mockResolvedValueOnce(staff);

		const result = await sut.execute({
			id: staff.id.toString(),
			companyId: companyId.toString(),
		});

		expect(result.isRight()).toBe(true);
		expect(mockStaffRepository.delete).toHaveBeenCalledWith(
			staff.id.toString(),
		);
	});
});
