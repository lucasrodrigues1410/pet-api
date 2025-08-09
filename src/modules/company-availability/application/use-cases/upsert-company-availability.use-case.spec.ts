import { beforeEach, describe, expect, it } from "bun:test";
import { faker } from "@faker-js/faker";
import { makeCompany } from "test/factories/make-company";
import { InMemoryCompanyRepository } from "test/repositories/in-memory-company.repository";
import { InMemoryCompanyAvailabilityRepository } from "test/repositories/in-memory-company-availability.repository";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { DaysOfWeek } from "@/modules/company-availability/domain/entities/company-availability.entity";
import { UpsertCompanyAvailabilityUseCase } from "./upsert-company-availability.use-case";

let availabilityRepo: InMemoryCompanyAvailabilityRepository;
let companyRepo: InMemoryCompanyRepository;
let sut: UpsertCompanyAvailabilityUseCase;

describe("UpsertCompanyAvailabilityUseCase", () => {
	beforeEach(() => {
		availabilityRepo = new InMemoryCompanyAvailabilityRepository();
		companyRepo = new InMemoryCompanyRepository();
		sut = new UpsertCompanyAvailabilityUseCase(availabilityRepo);
	});

	it("should create or update availability for a day when user is owner", async () => {
		const company = makeCompany({}, new UniqueEntityID());
		await companyRepo.create(company, faker.string.uuid());

		const result = await sut.execute({
			companyId: company.id.toString(),
			day: DaysOfWeek.MONDAY,
			startTime: "08:00",
			endTime: "18:00",
			lunchStartTime: "12:00",
			lunchEndTime: "13:00",
		});

		expect(result.isRight()).toBeTruthy();
		expect(availabilityRepo.items).toHaveLength(1);
	});
});
