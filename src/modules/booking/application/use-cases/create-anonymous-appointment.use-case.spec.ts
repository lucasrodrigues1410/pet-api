import { beforeEach, describe, expect, it } from "bun:test";
import { add } from "date-fns";
import { InMemoryAnimalRepository } from "test/repositories/in-memory-animal.repository";
import { InMemoryAppointmentRepository } from "test/repositories/in-memory-appointment.repository";
import { InMemoryBreedRepository } from "test/repositories/in-memory-breed.repository";
import { InMemoryServiceRepository } from "test/repositories/in-memory-service.repository";
import { InMemoryUserRepository } from "test/repositories/in-memory-user.repository";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { AnimalRepository } from "@/modules/animal/domain/repositories/animal.repository";
import { CoatType } from "@/modules/appointment/domain/enums/appointment.enum";
import { Breed } from "@/modules/breed/domain/entities/breed.entity";
import { BreedRepository } from "@/modules/breed/domain/repositories/breed.repository";
import { PriceCalculator } from "@/modules/price-variation/application/services/price-calculator.service";
import { Service } from "@/modules/service/domain/entities/service.entity";
import { PriceRange } from "@/modules/service/domain/entities/value-objects/price-range.value-object";
import { ServiceRepository } from "@/modules/service/domain/repositories/service.repository";
import { UserRepository } from "@/modules/user/domain/repositories/user.repository";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { AppointmentRepository } from "../../../appointment/domain/repositories/appointment.repository";
import { TimeSlotUnavailableError } from "../errors/time-slot-unavailable.error";
import { AppointmentAvailabilityService } from "../services/appointment-availability.service";
import { CreateAnonymousAppointmentUseCase } from "./create-anonymous-appointment.use-case";

describe("CreateAnonymousAppointmentUseCase", () => {
	let useCase: CreateAnonymousAppointmentUseCase;
	let appointmentAvailabilityService: AppointmentAvailabilityService;
	let serviceRepository: ServiceRepository;
	let priceCalculator: PriceCalculator;
	let breedRepository: BreedRepository;
	let appointmentRepository: AppointmentRepository;
	let userRepository: UserRepository;
	let animalRepository: AnimalRepository;

	beforeEach(() => {
		appointmentAvailabilityService = {
			getAvailability: () =>
				Promise.resolve({
					isValid: true,
					staffChoiced: {
						id: new UniqueEntityID("staff-123"),
						name: "João Silva",
					},
				}),
		} as any;

		serviceRepository = new InMemoryServiceRepository();
		priceCalculator = {
			calculate: () => Promise.resolve(10.0),
		} as any;
		breedRepository = new InMemoryBreedRepository();
		appointmentRepository = new InMemoryAppointmentRepository();
		userRepository = new InMemoryUserRepository();
		animalRepository = new InMemoryAnimalRepository();

		useCase = new CreateAnonymousAppointmentUseCase(
			appointmentAvailabilityService,
			serviceRepository,
			priceCalculator,
			breedRepository,
			appointmentRepository,
			userRepository,
			animalRepository,
		);
	});

	it("should create an anonymous appointment successfully", async () => {
		// Arrange
		const companyId = "company-123";
		const serviceId = "service-123";
		const date = add(new Date(), { days: 1 }); // Use a future date

		const mockService = Service.create(
			{
				name: "Banho e Tosa",
				description: "Serviço completo",
				price: 50.0,
				duration: 60,
				companyId: new UniqueEntityID(companyId),
				isActive: true,
				details: {},
				priceRange: PriceRange.create({ min: 0, max: 1000 }),
			},
			new UniqueEntityID(serviceId), // Set the specific ID
		);

		const mockBreed = Breed.create({
			name: "Golden Retriever",
			animalTypeId: new UniqueEntityID("type-123"),
		});

		await serviceRepository.create(mockService);
		await breedRepository.create(mockBreed);

		// Usar o ID real da raça criada
		const actualBreedId = mockBreed.id.toString();

		// Act
		const result = await useCase.execute({
			serviceId,
			companyId,
			date,
			coatType: CoatType.MEDIUM,
			animal: {
				name: "Rex",
				weight: 25.5,
				breedId: actualBreedId,
			},
			client: {
				name: "João Silva",
				phone: "11999999999",
				email: "joao@email.com",
			},
		});

		// Assert
		expect(result.isRight()).toBe(true);
		if (result.isRight()) {
			expect(result.value.appointmentId).toBeDefined();
			expect(result.value.animalId).toBeDefined();
			expect(result.value.clientId).toBeDefined();
		}
	});

	it("should return error when service is not found", async () => {
		// Act
		const result = await useCase.execute({
			serviceId: "invalid-service",
			companyId: "company-123",
			date: new Date(),
			coatType: CoatType.MEDIUM,
			animal: {
				name: "Rex",
				weight: 25.5,
				breedId: "breed-123",
			},
			client: {
				name: "João Silva",
				phone: "11999999999",
				email: "joao@email.com",
			},
		});

		// Assert
		expect(result.isLeft()).toBe(true);
		if (result.isLeft()) {
			expect(result.value).toBeInstanceOf(ResourceNotFoundError);
			expect(result.value.message).toBe("Serviço não encontrado");
		}
	});

	it("should return error when service does not belong to company", async () => {
		// Arrange
		const mockService = Service.create(
			{
				name: "Banho e Tosa",
				description: "Serviço completo",
				price: 50.0,
				duration: 60,
				companyId: new UniqueEntityID("different-company"),
				isActive: true,
				priceRange: PriceRange.create({ min: 0, max: 1000 }),
				details: {},
			},
			new UniqueEntityID("service-123"),
		); // Set the specific ID

		await serviceRepository.create(mockService);

		// Act
		const result = await useCase.execute({
			serviceId: "service-123",
			companyId: "company-123",
			date: new Date(),
			coatType: CoatType.MEDIUM,
			animal: {
				name: "Rex",
				weight: 25.5,
				breedId: "breed-123",
			},
			client: {
				name: "João Silva",
				phone: "11999999999",
				email: "joao@email.com",
			},
		});

		// Assert
		expect(result.isLeft()).toBe(true);
		if (result.isLeft()) {
			expect(result.value).toBeInstanceOf(ResourceNotFoundError);
			expect(result.value.message).toBe("Serviço não pertence à empresa");
		}
	});

	it("should return error when breed is not found", async () => {
		// Arrange
		const mockService = Service.create(
			{
				name: "Banho e Tosa",
				description: "Serviço completo",
				price: 50.0,
				duration: 60,
				companyId: new UniqueEntityID("company-123"),
				isActive: true,
				priceRange: PriceRange.create({ min: 0, max: 1000 }),
				details: {},
			},
			new UniqueEntityID("service-123"),
		); // Set the specific ID

		await serviceRepository.create(mockService);

		// Act
		const result = await useCase.execute({
			serviceId: "service-123",
			companyId: "company-123",
			date: new Date(),
			coatType: CoatType.MEDIUM,
			animal: {
				name: "Rex",
				weight: 25.5,
				breedId: "invalid-breed",
			},
			client: {
				name: "João Silva",
				phone: "11999999999",
				email: "joao@email.com",
			},
		});

		// Assert
		expect(result.isLeft()).toBe(true);
		if (result.isLeft()) {
			expect(result.value).toBeInstanceOf(ResourceNotFoundError);
			expect(result.value.message).toBe("Raça não encontrada");
		}
	});

	it("should return error when time slot is unavailable", async () => {
		// Arrange
		const mockService = Service.create(
			{
				name: "Banho e Tosa",
				description: "Serviço completo",
				price: 50.0,
				duration: 60,
				companyId: new UniqueEntityID("company-123"),
				isActive: true,
				priceRange: PriceRange.create({ min: 0, max: 1000 }),
				details: {},
			},
			new UniqueEntityID("service-123"),
		); // Set the specific ID

		const mockBreed = Breed.create({
			name: "Golden Retriever",
			animalTypeId: new UniqueEntityID("type-123"),
		});

		await serviceRepository.create(mockService);
		await breedRepository.create(mockBreed);

		// Mock indisponibilidade
		appointmentAvailabilityService.getAvailability = () =>
			Promise.resolve({ isValid: false, staffChoiced: null });

		// Act
		const result = await useCase.execute({
			serviceId: "service-123",
			companyId: "company-123",
			date: add(new Date(), { days: 1 }), // Use a future date
			coatType: CoatType.MEDIUM,
			animal: {
				name: "Rex",
				weight: 25.5,
				breedId: mockBreed.id.toString(), // Use the actual breed ID
			},
			client: {
				name: "João Silva",
				phone: "11999999999",
				email: "joao@email.com",
			},
		});

		// Assert
		expect(result.isLeft()).toBe(true);
		if (result.isLeft()) {
			expect(result.value).toBeInstanceOf(TimeSlotUnavailableError);
			expect(result.value.message).toBe("Horário indisponível");
		}
	});
});
