import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { CacheRepository } from "@/core/domain/interfaces/cache-repository.interface";
import { Category } from "@/modules/category/domain/entities/category.entity";
import { Company } from "@/modules/company/domain/entities/company.entity";
import {
	Service,
	ServiceWithRelations,
} from "../../domain/entities/service.entity";
import { ServiceRepository } from "../../domain/repositories/service.repository";
import { GetServiceRecommendationsUseCase } from "./get-service-recommendations.use-case";

describe("GetServiceRecommendationsUseCase", () => {
	let useCase: GetServiceRecommendationsUseCase;
	let serviceRepository: jest.Mocked<ServiceRepository>;
	let cacheRepository: jest.Mocked<CacheRepository>;

	beforeEach(() => {
		serviceRepository = {
			findMostPopular: jest.fn(),
		} as any;

		cacheRepository = {
			get: jest.fn(),
			set: jest.fn(),
			delete: jest.fn(),
		} as any;

		useCase = new GetServiceRecommendationsUseCase(
			serviceRepository,
			cacheRepository,
		);
	});

	it("should return cached recommendations when available", async () => {
		const cachedData = [
			{
				id: "service-1",
				name: "Banho e Tosa",
				description: "Serviço completo de banho e tosa",
				price: 50,
				duration: 60,
				company: {
					id: "company-1",
					name: "Pet Shop ABC",
					contact: "contact@petshop.com",
				},
				categories: [
					{
						id: "category-1",
						name: "Higiene",
					},
				],
			},
		];

		cacheRepository.get.mockResolvedValue(JSON.stringify(cachedData));

		const result = await useCase.execute({ limit: 5 });

		expect(result.isRight()).toBe(true);
		expect(result.value?.services).toEqual(cachedData);
		expect(serviceRepository.findMostPopular).not.toHaveBeenCalled();
	});

	it("should fetch from database and cache when not in cache", async () => {
		cacheRepository.get.mockResolvedValue(null);

		const mockService = Service.create(
			{
				name: "Banho e Tosa",
				description: "Serviço completo de banho e tosa",
				price: 50,
				duration: 60,
				companyId: new UniqueEntityID("company-1"),
				isActive: true,
			},
			new UniqueEntityID("service-1"),
		);

		const mockCompany = Company.create(
			{
				name: "Pet Shop ABC",
				contact: "contact@petshop.com",
			},
			new UniqueEntityID("company-1"),
		);

		const mockCategory = Category.create(
			{
				name: "Higiene",
			},
			new UniqueEntityID("category-1"),
		);

		const serviceWithRelations: ServiceWithRelations = Object.assign(
			mockService,
			{
				company: mockCompany,
				categories: [mockCategory],
			},
		);

		serviceRepository.findMostPopular.mockResolvedValue([serviceWithRelations]);

		const result = await useCase.execute({ limit: 5 });

		expect(result.isRight()).toBe(true);
		expect(result.value?.services).toHaveLength(1);
		expect(result.value?.services[0].name).toBe("Banho e Tosa");
		expect(serviceRepository.findMostPopular).toHaveBeenCalledWith(20);
		expect(cacheRepository.set).toHaveBeenCalled();
	});

	it("should respect limit parameter", async () => {
		const cachedData = Array.from({ length: 20 }, (_, i) => ({
			id: `service-${i + 1}`,
			name: `Serviço ${i + 1}`,
			description: `Descrição ${i + 1}`,
			price: 50 + i,
			duration: 60,
			company: {
				id: "company-1",
				name: "Pet Shop ABC",
				contact: "contact@petshop.com",
			},
			categories: [
				{
					id: "category-1",
					name: "Higiene",
				},
			],
		}));

		cacheRepository.get.mockResolvedValue(JSON.stringify(cachedData));

		const result = await useCase.execute({ limit: 5 });

		expect(result.isRight()).toBe(true);
		expect(result.value?.services).toHaveLength(5);
	});
});
