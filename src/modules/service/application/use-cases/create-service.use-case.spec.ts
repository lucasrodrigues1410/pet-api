import { beforeEach, describe, expect, it, jest } from "bun:test";
import { Test } from "@nestjs/testing";
import { makeStaff } from "test/factories/make-staff";
import { StaffRepository } from "@/modules/staff/domain/repositories/staff.repository";
import { ServiceRepository } from "../../domain/repositories/service.repository";
import { CreateServiceUseCase } from "./create-service.use-case";
import { TranslateRulesUseCase } from "./translate-rules.use-case";

let mockServiceRepository: { create: ReturnType<typeof jest.fn> };
let mockStaffRepository: { findByUserId: ReturnType<typeof jest.fn> };
let mockTranslateRulesUseCase: { execute: ReturnType<typeof jest.fn> };
let sut: CreateServiceUseCase;
let moduleRef: any;

describe("Create Service Use Case", () => {
	beforeEach(async () => {
		mockServiceRepository = { create: jest.fn(async () => undefined) };
		mockStaffRepository = { findByUserId: jest.fn(async () => null) };
		mockTranslateRulesUseCase = { execute: jest.fn(async () => []) };

		moduleRef = await Test.createTestingModule({
			providers: [
				CreateServiceUseCase,
				{ provide: ServiceRepository, useValue: mockServiceRepository },
				{ provide: StaffRepository, useValue: mockStaffRepository },
				{ provide: TranslateRulesUseCase, useValue: mockTranslateRulesUseCase },
			],
		}).compile();

		sut = moduleRef.get(CreateServiceUseCase);
	});

	it("should create a service without categories", async () => {
		const staff = makeStaff();
		mockStaffRepository.findByUserId.mockResolvedValueOnce(staff);

		const result = await sut.execute({
			name: "Banho e Tosa",
			description: "Serviço de banho e tosa para pets",
			price: 80.0,
			duration: 120,
			userId: staff.userId.toString(),
		});

		expect(result.isRight()).toBe(true);
		expect(mockStaffRepository.findByUserId).toHaveBeenCalledWith(
			staff.userId.toString(),
		);
		expect(mockServiceRepository.create).toHaveBeenCalled();
		// Categories not provided
		const [, passedCategories] = mockServiceRepository.create.mock.calls[0];
		expect(passedCategories).toBeUndefined();
	});

	it("should create a service with one category", async () => {
		const staff = makeStaff();
		mockStaffRepository.findByUserId.mockResolvedValueOnce(staff);

		const result = await sut.execute({
			name: "Consulta Veterinária",
			description: "Consulta veterinária básica",
			price: 100.0,
			duration: 60,
			userId: staff.userId.toString(),
			categoryIds: ["category-123"],
		});

		expect(result.isRight()).toBe(true);
		expect(mockServiceRepository.create).toHaveBeenCalled();
		const [, passedCategories] = mockServiceRepository.create.mock.calls[0];
		expect(passedCategories).toEqual(["category-123"]);
	});

	it("should create a service with multiple categories", async () => {
		const staff = makeStaff();
		mockStaffRepository.findByUserId.mockResolvedValueOnce(staff);

		const result = await sut.execute({
			name: "Pacote Completo",
			description: "Pacote com múltiplos serviços",
			price: 200.0,
			duration: 180,
			userId: staff.userId.toString(),
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
		mockStaffRepository.findByUserId.mockResolvedValueOnce(null);

		const result = await sut.execute({
			name: "Serviço Teste",
			description: "Descrição do serviço",
			price: 50.0,
			duration: 30,
			userId: "non-existent-user-id",
		});

		expect(result.isLeft()).toBe(true);
		if (result.isLeft()) {
			expect(result.value.message).toBe("Funcionário não encontrado");
		}
	});
});
