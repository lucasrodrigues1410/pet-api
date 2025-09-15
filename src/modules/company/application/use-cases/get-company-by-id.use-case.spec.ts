import { beforeEach, describe, expect, it, jest } from "bun:test";
import { Test } from "@nestjs/testing";
import { makeCompany } from "test/factories/make-company";
import { CompanyRepository } from "../../domain/repositories/company.repository";
import { GetCompanyByIdUseCase } from "./get-company-by-id.use-case";

let moduleRef: any;
let sut: GetCompanyByIdUseCase;
const mockCompanyRepository = { findById: jest.fn() };

describe("Get a company", () => {
	beforeEach(async () => {
		mockCompanyRepository.findById.mockReset();

		moduleRef = await Test.createTestingModule({
			providers: [
				GetCompanyByIdUseCase,
				{ provide: CompanyRepository, useValue: mockCompanyRepository },
			],
		}).compile();

		sut = moduleRef.get(GetCompanyByIdUseCase);
	});

	it("should get a company by id", async () => {
		const company = makeCompany();
		mockCompanyRepository.findById.mockResolvedValueOnce(company as any);
		const result = await sut.execute({ id: company.id.toString() });
		expect(result.isRight()).toBe(true);
		if (result.isRight()) {
			expect(result.value.company.id.toString()).toBe(company.id.toString());
			expect(result.value.company.name).toBe(company.name);
		}
	});
});
