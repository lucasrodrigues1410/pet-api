import { makeCompany } from "test/factories/make-company";
import { InMemoryCompanyRepository } from "test/repositories/in-memory-company.repository";
import { beforeEach, describe, expect, it } from "vitest";
import { GetCompanyByIdUseCase } from "./get-company-by-id.use-case";

let inMemoryCompaniesRepository: InMemoryCompanyRepository;
let useCase: GetCompanyByIdUseCase;

describe("Get a company", () => {
	beforeEach(() => {
		inMemoryCompaniesRepository = new InMemoryCompanyRepository();
		useCase = new GetCompanyByIdUseCase(inMemoryCompaniesRepository);
	});

	it("should get a company by id", async () => {
		const company = makeCompany();
		inMemoryCompaniesRepository.create(company);
		const result = await useCase.execute({
			id: company.id.toString(),
		});
		expect(result.isRight()).toBe(true);
		expect(result.value).toMatchObject({
			company: expect.objectContaining({
				name: company.name,
				address: company.address,
				contact: company.contact,
			}),
		});
	});
});
