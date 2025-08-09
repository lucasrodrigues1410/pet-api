import { beforeEach, describe, expect, it } from "bun:test";
import { faker } from "@faker-js/faker";
import { makeCompany } from "test/factories/make-company";
import { InMemoryCompanyRepository } from "test/repositories/in-memory-company.repository";
import { InMemoryCompanyAvailabilityRepository } from "test/repositories/in-memory-company-availability.repository";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import {
	CompanyAvailability,
	DaysOfWeek,
} from "@/modules/company-availability/domain/entities/company-availability.entity";
import { DeleteCompanyAvailabilityUseCase } from "./delete-company-availability.use-case";

let availabilityRepo: InMemoryCompanyAvailabilityRepository;
let companyRepo: InMemoryCompanyRepository;
let sut: DeleteCompanyAvailabilityUseCase;

describe("DeleteCompanyAvailabilityUseCase", () => {
	beforeEach(() => {
		availabilityRepo = new InMemoryCompanyAvailabilityRepository();
		companyRepo = new InMemoryCompanyRepository();
		sut = new DeleteCompanyAvailabilityUseCase(
			availabilityRepo,
		);
	});

	it("should delete availability for a day when user is owner", async () => {
		const company = makeCompany({}, new UniqueEntityID());
		await companyRepo.create(company, faker.string.uuid());

		availabilityRepo.items.push(
			CompanyAvailability.create({
				companyId: new UniqueEntityID(company.id.toString()),
				day: DaysOfWeek.WEDNESDAY,
				startTime: "09:00",
				endTime: "17:00",
				lunchStartTime: "12:00",
				lunchEndTime: "13:00",
			}),
		);

		const result = await sut.execute({
			companyId: company.id.toString(),
			day: DaysOfWeek.WEDNESDAY,
		});

		expect(result.isRight()).toBeTruthy();
		const left = await availabilityRepo.findByCompanyIdAndDayOfWeek(
			company.id.toString(),
			DaysOfWeek.WEDNESDAY,
		);
		expect(left).toBeNull();
	});
});
