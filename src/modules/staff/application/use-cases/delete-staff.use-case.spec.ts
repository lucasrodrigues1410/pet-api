import { beforeEach, describe, expect, it, jest } from "bun:test";
import { Test } from "@nestjs/testing";
import { makeStaff } from "test/factories/make-staff";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { StaffRepository } from "../../domain/repositories/staff.repository";
import { DeleteStaffUseCase } from "./delete-staff.use-case";

describe("DeleteStaffUseCase", () => {
	const repo = { findById: jest.fn(), delete: jest.fn() };
	let sut: DeleteStaffUseCase;
	let moduleRef: any;

	beforeEach(async () => {
		repo.findById.mockReset();
		repo.delete.mockReset();
		moduleRef = await Test.createTestingModule({
			providers: [
				DeleteStaffUseCase,
				{ provide: StaffRepository, useValue: repo },
			],
		}).compile();
		sut = moduleRef.get(DeleteStaffUseCase);
	});

	it("should delete staff when it belongs to the company", async () => {
		const companyId = new UniqueEntityID();
		const staff = makeStaff({ companyId });
		repo.findById.mockResolvedValue(staff);
		repo.delete.mockResolvedValue(undefined);

		const result = await sut.execute({
			id: staff.id.toString(),
			companyId: companyId.toString(),
		});
		expect(result.isRight()).toBe(true);
		expect(repo.delete).toHaveBeenCalledWith(staff.id.toString());
	});

	it("should return left when staff not found or does not belong to company", async () => {
		const companyId = new UniqueEntityID();
		const otherCompanyStaff = makeStaff({ companyId: new UniqueEntityID() });
		repo.findById.mockResolvedValue(otherCompanyStaff);

		const result = await sut.execute({
			id: otherCompanyStaff.id.toString(),
			companyId: companyId.toString(),
		});
		expect(result.isLeft()).toBe(true);
		expect(repo.delete).not.toHaveBeenCalled();
	});
});
