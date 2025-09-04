import { beforeEach, describe, expect, it } from "bun:test";
import { makeStaff } from "test/factories/make-staff";
import { InMemoryStaffRepository } from "test/repositories/in-memory-staff.repository";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { ListStaffByCompanyUseCase } from "./list-staff-by-company.use-case";

describe("ListStaffByCompanyUseCase", () => {
	let inMemoryStaffRepository: InMemoryStaffRepository;
	let sut: ListStaffByCompanyUseCase;

	beforeEach(() => {
		inMemoryStaffRepository = new InMemoryStaffRepository();
		sut = new ListStaffByCompanyUseCase(inMemoryStaffRepository);
	});

	it("should list staff by company id", async () => {
		const companyId = new UniqueEntityID();
		const staffA = makeStaff({ companyId });
		const staffB = makeStaff({ companyId });
		const otherCompanyStaff = makeStaff({ companyId: new UniqueEntityID() });

		await inMemoryStaffRepository.create(staffA);
		await inMemoryStaffRepository.create(staffB);
		await inMemoryStaffRepository.create(otherCompanyStaff);

		const result = await sut.execute({ companyId: companyId.toString(), query: { page: 1, limit: 10 } });

		expect(result.isRight()).toBe(true);
		if (result.isRight()) {
			expect(result.value.items).toHaveLength(2);
			expect(result.value.items.map((s) => s.id.toString())).toEqual(
				expect.arrayContaining([staffA.id.toString(), staffB.id.toString()]),
			);
		}
	});
});
