import { beforeEach, describe, expect, it } from "bun:test";
import { makeStaff } from "test/factories/make-staff";
import { InMemoryStaffRepository } from "test/repositories/in-memory-staff.repository";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { DeleteStaffUseCase } from "./delete-staff.use-case";

describe("DeleteStaffUseCase", () => {
	let repo: InMemoryStaffRepository;
	let sut: DeleteStaffUseCase;

	beforeEach(() => {
		repo = new InMemoryStaffRepository();
		sut = new DeleteStaffUseCase(repo);
	});

	it("should delete staff when it belongs to the company", async () => {
		const companyId = new UniqueEntityID();
		const staff = makeStaff({ companyId });
		await repo.create(staff);

		const result = await sut.execute({
			id: staff.id.toString(),
			companyId: companyId.toString(),
		});
		expect(result.isRight()).toBe(true);
		expect(
			repo.items.find((s) => s.id.toString() === staff.id.toString()),
		).toBeUndefined();
	});

	it("should return left when staff not found or does not belong to company", async () => {
		const companyId = new UniqueEntityID();
		const otherCompanyStaff = makeStaff({ companyId: new UniqueEntityID() });
		await repo.create(otherCompanyStaff);

		const result = await sut.execute({
			id: otherCompanyStaff.id.toString(),
			companyId: companyId.toString(),
		});
		expect(result.isLeft()).toBe(true);
	});
});
