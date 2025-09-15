import { beforeEach, describe, expect, it, jest } from "bun:test";
import { Test } from "@nestjs/testing";
import { makeCompany } from "test/factories/make-company";
import { CompanyRepository } from "@/modules/company/domain/repositories/company.repository";
import { ServiceRepository } from "../../domain/repositories/service.repository";
import { CreateServiceUseCase } from "./create-service.use-case";
import { TranslateRulesUseCase } from "./translate-rules.use-case";

let mockServiceRepository: { create: ReturnType<typeof jest.fn> };
let mockCompanyRepository: { findById: ReturnType<typeof jest.fn> };
let mockTranslateRulesUseCase: { execute: ReturnType<typeof jest.fn> };
let sut: CreateServiceUseCase;
let moduleRef: any;

describe("Create Service Use Case", () => {
	beforeEach(async () => {
		mockServiceRepository = { create: jest.fn(async () => undefined) };
		mockCompanyRepository = { findById: jest.fn(async () => null) };
		mockTranslateRulesUseCase = { execute: jest.fn(async () => []) };

		moduleRef = await Test.createTestingModule({
			providers: [
				CreateServiceUseCase,
				{ provide: ServiceRepository, useValue: mockServiceRepository },
				{ provide: CompanyRepository, useValue: mockCompanyRepository },
				{ provide: TranslateRulesUseCase, useValue: mockTranslateRulesUseCase },
			],
		}).compile();

		sut = moduleRef.get(CreateServiceUseCase);
	});

	it("should create a service without categories", async () => {
		const company = makeCompany();
		mockCompanyRepository.findById.mockResolvedValueOnce(company);

		const result = await sut.execute({
			name: "Banho e Tosa",
			description: "Serviço de banho e tosa para pets",
			price: 80.0,
			duration: 120,
			companyId: company.id.toString(),
		});

		expect(result.isRight()).toBe(true);
		expect(mockCompanyRepository.findById).toHaveBeenCalledWith(
			company.id.toString(),
		);
		expect(mockServiceRepository.create).toHaveBeenCalled();
		// Categories not provided
		const [, passedCategories] = mockServiceRepository.create.mock.calls[0];
		expect(passedCategories).toBeUndefined();
	});

	it("should create a service with one category", async () => {
		const company = makeCompany();
		mockCompanyRepository.findById.mockResolvedValueOnce(company);

		const result = await sut.execute({
			name: "Consulta Veterinária",
			description: "Consulta veterinária básica",
			price: 100.0,
			duration: 60,
			companyId: company.id.toString(),
			categoryIds: ["category-123"],
		});

		expect(result.isRight()).toBe(true);
		expect(mockServiceRepository.create).toHaveBeenCalled();
		const [, passedCategories] = mockServiceRepository.create.mock.calls[0];
		expect(passedCategories).toEqual(["category-123"]);
	});

	it("should create a service with multiple categories", async () => {
		const company = makeCompany();
		mockCompanyRepository.findById.mockResolvedValueOnce(company);

		const result = await sut.execute({
			name: "Pacote Completo",
			description: "Pacote com múltiplos serviços",
			price: 200.0,
			duration: 180,
			companyId: company.id.toString(),
			categoryIds: ["category-123", "category-456", "category-789"],
		});

		expect(result.isRight()).toBe(true);
		expect(mockServiceRepository.create).toHaveBeenCalled();
		const [, passedCategories] = mockServiceRepository.create.mock.calls[0];
		expect(passedCategories).toEqual([
			"category-123",
			"category-456",
			"category-789",
		]);
	});

	it("should return error when company not found", async () => {
		mockCompanyRepository.findById.mockResolvedValueOnce(null);

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
