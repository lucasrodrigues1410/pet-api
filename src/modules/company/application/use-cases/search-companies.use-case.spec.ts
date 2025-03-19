import { makeCompany } from "test/factories/make-company";
import { InMemoryCompanyRepository } from "test/repositories/in-memory-company.repository";
import { SearchCompaniesUseCase } from "./search-companies.use-case";

let inMemoryCompaniesRepository: InMemoryCompanyRepository;
let sut: SearchCompaniesUseCase;

describe("List services by company", () => {
	beforeEach(() => {
		inMemoryCompaniesRepository = new InMemoryCompanyRepository();
		sut = new SearchCompaniesUseCase(inMemoryCompaniesRepository);
	});

	it("should search companies", async () => {
		const companies = Array.from({ length: 5 }, () => makeCompany());

		for (const company of companies) {
			inMemoryCompaniesRepository.create(company);
		}
		const result = await sut.execute({
			query: "",
		});

		expect(result.isRight()).toBe(true);
		expect(result.value?.companies).toHaveLength(5);
	});
});
