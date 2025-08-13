import { beforeEach, describe, expect, it } from "bun:test";
import { faker } from "@faker-js/faker";
import { makeCompany } from "test/factories/make-company";
import { InMemoryCompanyRepository } from "test/repositories/in-memory-company.repository";
import { UpdateCompanyUseCase } from "./update-company.use-case";

let inMemoryCompanyRepository: InMemoryCompanyRepository;
let sut: UpdateCompanyUseCase;

describe("UpdateCompanyUseCase", () => {
	beforeEach(() => {
		inMemoryCompanyRepository = new InMemoryCompanyRepository();
		sut = new UpdateCompanyUseCase(inMemoryCompanyRepository);
	});

	it("should update company when user is owner", async () => {
		const ownerUserId = faker.string.uuid();
		const company = makeCompany();
		await inMemoryCompanyRepository.create(company, ownerUserId);

		const newName = faker.company.name();
		const result = await sut.execute({
			companyId: company.id.toString(),
			name: newName,
		});

		expect(result.isRight()).toBeTruthy();
		if (result.isRight()) {
			expect(result.value.company.name).toEqual(newName);
		}
	});
});
