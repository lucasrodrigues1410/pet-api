import { beforeEach, describe, expect, it, jest } from "bun:test";
import { Test } from "@nestjs/testing";
import { makeStaff } from "test/factories/make-staff";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { StaffRepository } from "../../domain/repositories/staff.repository";
import { ListStaffByCompanyUseCase } from "./list-staff-by-company.use-case";

describe("ListStaffByCompanyUseCase", () => {
	const mockRepo = { findByCompanyId: jest.fn() };
	let sut: ListStaffByCompanyUseCase;
	let moduleRef: any;

	beforeEach(async () => {
		mockRepo.findByCompanyId.mockReset();
		moduleRef = await Test.createTestingModule({
			providers: [
				ListStaffByCompanyUseCase,
				{ provide: StaffRepository, useValue: mockRepo },
			],
		}).compile();
		sut = moduleRef.get(ListStaffByCompanyUseCase);
	});

	it("should list staff by company id", async () => {
		const companyId = new UniqueEntityID();
		const staffA = makeStaff({ companyId });
		const staffB = makeStaff({ companyId });

		mockRepo.findByCompanyId.mockResolvedValue({
			items: [staffA, staffB],
			total: 2,
			page: 1,
			limit: 10,
		});

		const result = await sut.execute({
			companyId: companyId.toString(),
			query: { page: 1, limit: 10 },
		});

		expect(result.isRight()).toBe(true);
		if (result.isRight()) {
			expect(result.value.items).toHaveLength(2);
			expect(result.value.items.map((s) => s.id.toString())).toEqual(
				expect.arrayContaining([staffA.id.toString(), staffB.id.toString()]),
			);
		}
	});
});
