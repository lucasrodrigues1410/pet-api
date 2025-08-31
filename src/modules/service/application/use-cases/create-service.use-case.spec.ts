import { beforeEach, describe, expect, it } from "bun:test";
import { makeCompany } from "test/factories/make-company";
import { InMemoryCompanyRepository } from "test/repositories/in-memory-company.repository";
import { InMemoryServiceRepository } from "test/repositories/in-memory-service.repository";
import { CreateServiceUseCase } from "./create-service.use-case";

let inMemoryServiceRepository: InMemoryServiceRepository;
let inMemoryCompanyRepository: InMemoryCompanyRepository;
let sut: CreateServiceUseCase;

describe("Create Service Use Case", () => {
	beforeEach(() => {
		inMemoryServiceRepository = new InMemoryServiceRepository();
		inMemoryCompanyRepository = new InMemoryCompanyRepository();
		sut = new CreateServiceUseCase(
			inMemoryServiceRepository,
			inMemoryCompanyRepository,
			{} as any, // Mock do TranslateRulesUseCase
		);
	});

	it("should create a service without categories", async () => {
		const company = makeCompany();
		inMemoryCompanyRepository.items = [company];

		const result = await sut.execute({
			name: "Banho e Tosa",
			description: "Serviço de banho e tosa para pets",
			price: 80.0,
			duration: 120,
			companyId: company.id.toString(),
		});

		expect(result.isRight()).toBe(true);
		expect(inMemoryServiceRepository.items).toHaveLength(1);
		expect(inMemoryServiceRepository.items[0].name).toBe("Banho e Tosa");
	});

	it("should create a service with one category", async () => {
		const company = makeCompany();
		inMemoryCompanyRepository.items = [company];

		const result = await sut.execute({
			name: "Consulta Veterinária",
			description: "Consulta veterinária básica",
			price: 100.0,
			duration: 60,
			companyId: company.id.toString(),
			categoryIds: ["category-123"],
		});

		expect(result.isRight()).toBe(true);
		expect(inMemoryServiceRepository.items).toHaveLength(1);
		expect(inMemoryServiceRepository.items[0].name).toBe(
			"Consulta Veterinária",
		);
	});

	it("should create a service with multiple categories", async () => {
		const company = makeCompany();
		inMemoryCompanyRepository.items = [company];

		const result = await sut.execute({
			name: "Pacote Completo",
			description: "Pacote com múltiplos serviços",
			price: 200.0,
			duration: 180,
			companyId: company.id.toString(),
			categoryIds: ["category-123", "category-456", "category-789"],
		});

		expect(result.isRight()).toBe(true);
		expect(inMemoryServiceRepository.items).toHaveLength(1);
		expect(inMemoryServiceRepository.items[0].name).toBe("Pacote Completo");
	});

	it("should return error when company not found", async () => {
		const result = await sut.execute({
			name: "Serviço Teste",
			description: "Descrição do serviço",
			price: 50.0,
			duration: 30,
			companyId: "non-existent-company-id",
		});

		expect(result.isLeft()).toBe(true);
		if (result.isLeft()) {
			expect(result.value.message).toBe("Empresa não encontrada");
		}
	});
});
