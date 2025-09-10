import { beforeEach, describe, expect, it, jest } from "bun:test";
import { Test } from "@nestjs/testing";
import { makeAsset } from "test/factories/make-asset";
import { makeCompany } from "test/factories/make-company";
import { makeLocation } from "test/factories/make-location";
import { CompanyRepository } from "../../domain/repositories/company.repository";
import { SearchCompaniesUseCase } from "./search-companies.use-case";

let moduleRef: any;
let sut: SearchCompaniesUseCase;
const mockCompanyRepository = {
	findById: jest.fn(),
	searchCompanies: jest.fn(),
	update: jest.fn(),
};

describe("Search Companies Use Case", () => {
	beforeEach(async () => {
		mockCompanyRepository.findById.mockReset();
		mockCompanyRepository.searchCompanies.mockReset();
		mockCompanyRepository.update.mockReset();

		moduleRef = await Test.createTestingModule({
			providers: [
				SearchCompaniesUseCase,
				{ provide: CompanyRepository, useValue: mockCompanyRepository },
			],
		}).compile();

		sut = moduleRef.get(SearchCompaniesUseCase);
	});

	it("should search companies by name", async () => {
		const company1 = makeCompany({ name: "Pet Shop Bella Cane" });
		const company2 = makeCompany({ name: "Mundo Pet" });

		mockCompanyRepository.searchCompanies.mockResolvedValueOnce({
			items: [company1, company2],
			meta: { total: 2, totalPages: 1, page: 1, limit: 10 },
		});

		const result = await sut.execute({
			query: "pet",
			pagination: { page: 1, limit: 10 },
		});

		expect(result.isRight()).toBe(true);
		if (result.isRight()) {
			expect(result.value.companies.items).toHaveLength(2);
			const companyNames = result.value.companies.items.map((c) => c.name);
			expect(companyNames).toContain("Pet Shop Bella Cane");
			expect(companyNames).toContain("Mundo Pet");
		}
	});

	it("should search companies by description", async () => {
		const company1 = makeCompany({
			name: "Bella Cane",
			description: "Pet shop especializado em cuidados para cães",
		});
		makeCompany({
			name: "Mundo Animal",
			description: "Loja de ração e acessórios",
		});

		mockCompanyRepository.searchCompanies.mockResolvedValueOnce({
			items: [company1],
			meta: { total: 1, totalPages: 1, page: 1, limit: 10 },
		});

		const result = await sut.execute({
			query: "cães",
			pagination: { page: 1, limit: 10 },
		});

		expect(result.isRight()).toBe(true);
		if (result.isRight()) {
			expect(result.value.companies.items).toHaveLength(1);
			expect(result.value.companies.items[0].name).toBe("Bella Cane");
			expect(result.value.companies.items[0].description).toContain("cães");
		}
	});

	it("should search companies by location", async () => {
		const company1 = makeCompany({ name: "Pet Shop Centro" });
		const company2 = makeCompany({ name: "Pet Shop Zona Sul" });

		const location1 = makeLocation(
			{ latitude: -23.5505, longitude: -46.6333 },
			company1.id,
		);
		makeLocation({ latitude: -23.7, longitude: -46.8 }, company2.id);

		mockCompanyRepository.searchCompanies.mockResolvedValueOnce({
			items: [
				Object.assign(company1, {
					address: location1,
					image: makeAsset({}, company1.id),
				}),
			],
			meta: { total: 1, totalPages: 1, page: 1, limit: 10 },
		});

		const result = await sut.execute({
			location: { latitude: -23.5505, longitude: -46.6333, radiusInKm: 5 },
			pagination: { page: 1, limit: 10 },
		});

		expect(result.isRight()).toBe(true);
		if (result.isRight()) {
			expect(result.value.companies.items).toHaveLength(1);
			expect(result.value.companies.items[0].name).toBe("Pet Shop Centro");
		}
	});

	it("should search companies by query and location combined", async () => {
		const company1 = makeCompany({ name: "Pet Shop Centro" });
		const company2 = makeCompany({ name: "Veterinária Centro" });
		const company3 = makeCompany({ name: "Pet Shop Zona Sul" });

		const location1 = makeLocation(
			{ latitude: -23.5505, longitude: -46.6333 },
			company1.id,
		);
		makeLocation({ latitude: -23.5505, longitude: -46.6333 }, company2.id);
		makeLocation({ latitude: -23.7, longitude: -46.8 }, company3.id);

		mockCompanyRepository.searchCompanies.mockResolvedValueOnce({
			items: [
				Object.assign(company1, {
					address: location1,
					image: makeAsset({}, company1.id),
				}),
			],
			meta: { total: 1, totalPages: 1, page: 1, limit: 10 },
		});

		const result = await sut.execute({
			query: "pet",
			location: { latitude: -23.5505, longitude: -46.6333, radiusInKm: 5 },
			pagination: { page: 1, limit: 10 },
		});

		expect(result.isRight()).toBe(true);
		if (result.isRight()) {
			expect(result.value.companies.items).toHaveLength(1);
			expect(result.value.companies.items[0].name).toBe("Pet Shop Centro");
		}
	});

	it("should return companies with address and image data", async () => {
		const company = makeCompany({ name: "Pet Shop Teste" });
		const asset = makeAsset({}, company.id);

		const location = makeLocation(
			{
				addressLine: "Rua Teste",
				number: "100",
				complement: "Loja A",
				neighborhood: "Centro",
				city: "São Paulo",
				state: "SP",
				country: "Brasil",
				postalCode: "01000-000",
				latitude: -23.5505,
				longitude: -46.6333,
			},
			company.id,
		);

		mockCompanyRepository.searchCompanies.mockResolvedValueOnce({
			items: [Object.assign(company, { address: location, image: asset })],
			meta: { total: 1, totalPages: 1, page: 1, limit: 10 },
		});

		const result = await sut.execute({ pagination: { page: 1, limit: 10 } });

		expect(result.isRight()).toBe(true);
		if (result.isRight()) {
			expect(result.value.companies.items).toHaveLength(1);

			const returnedCompany = result.value.companies.items[0];
			expect(returnedCompany.address.addressLine).toBe("Rua Teste");
			expect(returnedCompany.address.city).toBe("São Paulo");
			expect(returnedCompany.image).toBeDefined();
			expect(returnedCompany.image.id.toString()).toBe(asset.id.toString());
		}
	});

	it("should return empty results when no companies match the query", async () => {
		makeCompany({ name: "Veterinária São João" });
		mockCompanyRepository.searchCompanies.mockResolvedValueOnce({
			items: [],
			meta: { total: 0, totalPages: 0, page: 1, limit: 10 },
		});

		const result = await sut.execute({
			query: "pet shop inexistente",
			pagination: { page: 1, limit: 10 },
		});

		expect(result.isRight()).toBe(true);
		if (result.isRight()) {
			expect(result.value.companies.items).toHaveLength(0);
		}
	});

	it("should handle pagination correctly", async () => {
		// Cria 15 empresas
		const companies = Array.from({ length: 15 }, (_, i) =>
			makeCompany({ name: `Pet Shop ${i + 1}` }),
		);
		mockCompanyRepository.searchCompanies.mockResolvedValueOnce({
			items: companies.slice(0, 10),
			meta: { total: 15, totalPages: 2, page: 1, limit: 10 },
		});

		const result = await sut.execute({
			query: "pet",
			pagination: { page: 1, limit: 10 },
		});

		expect(result.isRight()).toBe(true);
		if (result.isRight()) {
			expect(result.value.companies.items).toHaveLength(10);
			expect(result.value.companies.meta.total).toBe(15);
			expect(result.value.companies.meta.totalPages).toBe(2);
			expect(result.value.companies.meta.page).toBe(1);
		}
	});

	it("should return companies with default address when no location is set", async () => {
		const company = makeCompany({ name: "Pet Shop Sem Endereço" });
		const location = makeLocation({});
		mockCompanyRepository.searchCompanies.mockResolvedValueOnce({
			items: [
				Object.assign(company, {
					address: location,
					image: makeAsset({}, company.id),
				}),
			],
			meta: { total: 1, totalPages: 1, page: 1, limit: 10 },
		});

		const result = await sut.execute({ pagination: { page: 1, limit: 10 } });

		expect(result.isRight()).toBe(true);
		if (result.isRight()) {
			expect(result.value.companies.items).toHaveLength(1);

			const returnedCompany = result.value.companies.items[0];
			expect(returnedCompany.address).toBeDefined();
			expect(returnedCompany.address.addressLine).toBeDefined();
			expect(typeof returnedCompany.address.addressLine).toBe("string");
		}
	});
});
