import { beforeEach, describe, expect, it } from "bun:test";
import { makeAsset } from "test/factories/make-asset";
import { makeCompany } from "test/factories/make-company";
import { makeLocation } from "test/factories/make-location";
import { InMemoryCompanyRepository } from "test/repositories/in-memory-company.repository";
import { SearchCompaniesUseCase } from "./search-companies.use-case";

let inMemoryCompanyRepository: InMemoryCompanyRepository;
let sut: SearchCompaniesUseCase;

describe("Search Companies Use Case", () => {
	beforeEach(() => {
		inMemoryCompanyRepository = new InMemoryCompanyRepository();
		sut = new SearchCompaniesUseCase(inMemoryCompanyRepository);
	});

	it("should search companies by name", async () => {
		const company1 = makeCompany({ name: "Pet Shop Bella Cane" });
		const company2 = makeCompany({ name: "Mundo Pet" });
		const company3 = makeCompany({ name: "Veterinária São João" });

		inMemoryCompanyRepository.items.push(company1, company2, company3);

		const result = await sut.execute({
			query: "pet",
			pagination: { page: 1, limit: 10 },
		});

		expect(result.isRight()).toBe(true);
		if (result.isRight()) {
			expect(result.value.companies.items).toHaveLength(2);
			const companyNames = result.value.companies.items.map(c => c.name);
			expect(companyNames).toContain("Pet Shop Bella Cane");
			expect(companyNames).toContain("Mundo Pet");
		}
	});

	it("should search companies by description", async () => {
		const company1 = makeCompany({
			name: "Bella Cane",
			description: "Pet shop especializado em cuidados para cães",
		});
		const company2 = makeCompany({
			name: "Mundo Animal",
			description: "Loja de ração e acessórios",
		});

		inMemoryCompanyRepository.items.push(company1, company2);

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

		inMemoryCompanyRepository.items.push(company1, company2);

		// Adiciona localizações para as empresas - company1 próxima, company2 distante
		const location1 = makeLocation({
			latitude: -23.5505, // Próxima ao centro de busca
			longitude: -46.6333,
		}, company1.id); // Usa o mesmo ID da empresa
		const location2 = makeLocation({
			latitude: -23.7000, // Distante do centro de busca
			longitude: -46.8000,
		}, company2.id);

		inMemoryCompanyRepository.locations.push(location1, location2);

		const result = await sut.execute({
			location: {
				latitude: -23.5505,
				longitude: -46.6333,
				radiusInKm: 5,
			},
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

		inMemoryCompanyRepository.items.push(company1, company2, company3);

		// Adiciona localizações (apenas company1 e company2 no centro)
		const location1 = makeLocation({
			latitude: -23.5505, // No centro
			longitude: -46.6333,
		}, company1.id);
		const location2 = makeLocation({
			latitude: -23.5505, // No centro
			longitude: -46.6333,
		}, company2.id);
		const location3 = makeLocation({
			latitude: -23.7000, // Zona Sul (distante)
			longitude: -46.8000,
		}, company3.id);

		inMemoryCompanyRepository.locations.push(location1, location2, location3);

		const result = await sut.execute({
			query: "pet",
			location: {
				latitude: -23.5505,
				longitude: -46.6333,
				radiusInKm: 5,
			},
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

		inMemoryCompanyRepository.items.push(company);
		const location = makeLocation({
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
		}, company.id);
		inMemoryCompanyRepository.locations.push(location);
		inMemoryCompanyRepository.images.push(asset);

		const result = await sut.execute({
			pagination: { page: 1, limit: 10 },
		});

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
		const company = makeCompany({ name: "Veterinária São João" });
		inMemoryCompanyRepository.items.push(company);

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
		for (let i = 1; i <= 15; i++) {
			const company = makeCompany({ name: `Pet Shop ${i}` });
			inMemoryCompanyRepository.items.push(company);
		}

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
		inMemoryCompanyRepository.items.push(company);

		const result = await sut.execute({
			pagination: { page: 1, limit: 10 },
		});

		expect(result.isRight()).toBe(true);
		if (result.isRight()) {
			expect(result.value.companies.items).toHaveLength(1);

			const returnedCompany = result.value.companies.items[0];
			// Como não há location específica, usará o makeLocation() padrão
			expect(returnedCompany.address).toBeDefined();
			expect(returnedCompany.address.addressLine).toBeDefined();
			expect(typeof returnedCompany.address.addressLine).toBe("string");
		}
	});
});
