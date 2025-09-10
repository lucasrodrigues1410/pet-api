import { beforeEach, describe, expect, it, jest } from "bun:test";
import { Test } from "@nestjs/testing";
import { addMinutes } from "date-fns";
import { makeAnimal } from "test/factories/make-animal";
import { makeService } from "test/factories/make-service";
import { makeStaff } from "test/factories/make-staff";
import { AnimalRepository } from "@/modules/animal/domain/repositories/animal.repository";
import { AppointmentRepository } from "@/modules/appointment/domain/repositories/appointment.repository";
import { ServiceRepository } from "@/modules/service/domain/repositories/service.repository";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { TimeSlotUnavailableError } from "../errors/time-slot-unavailable.error";
import { AppointmentAvailabilityService } from "../services/appointment-availability.service";
import { RulesExecutionService } from "../services/rules-execution.service";
import { AppointmentBookingUseCase } from "./appointment-booking.use-case";

describe("Appointment Booking Use Case", () => {
	let moduleRef: any;
	let sut: AppointmentBookingUseCase;

	const mockServiceRepository = { findById: jest.fn() };

	const mockAnimalRepository = { findById: jest.fn() };

	const mockAppointmentRepository = { create: jest.fn() };

	const mockAppointmentAvailabilityService = { getAvailability: jest.fn() };

	const mockRulesExecutionService = { execute: jest.fn() };

	beforeEach(async () => {
		mockServiceRepository.findById.mockReset();
		mockAnimalRepository.findById.mockReset();
		mockAppointmentRepository.create.mockReset();
		mockAppointmentAvailabilityService.getAvailability.mockReset();
		mockRulesExecutionService.execute.mockReset();

		moduleRef = await Test.createTestingModule({
			providers: [
				AppointmentBookingUseCase,
				{ provide: ServiceRepository, useValue: mockServiceRepository },
				{ provide: AnimalRepository, useValue: mockAnimalRepository },
				{ provide: AppointmentRepository, useValue: mockAppointmentRepository },
				{
					provide: AppointmentAvailabilityService,
					useValue: mockAppointmentAvailabilityService,
				},
				{ provide: RulesExecutionService, useValue: mockRulesExecutionService },
			],
		}).compile();

		sut = moduleRef.get(AppointmentBookingUseCase);
	});

	it("should create an appointment successfully", async () => {
		const service = makeService({ isActive: true, price: 100, duration: 60 });
		const animal = makeAnimal();
		const staff = makeStaff();
		const futureDate = addMinutes(new Date(), 60);

		mockServiceRepository.findById.mockResolvedValueOnce(service);
		mockAnimalRepository.findById.mockResolvedValueOnce(animal);
		mockRulesExecutionService.execute.mockReturnValueOnce({
			price: 10,
			durationMinutes: 5,
		});
		mockAppointmentAvailabilityService.getAvailability.mockResolvedValueOnce({
			isValid: true,
			staffChoiced: staff,
		});
		mockAppointmentRepository.create.mockResolvedValueOnce(undefined);

		const result = await sut.execute({
			serviceId: service.id.toString(),
			animalId: animal.id.toString(),
			clientId: "client-id",
			date: futureDate,
			coatType: "short",
		});

		expect(result.isRight()).toBe(true);
		expect(result.value).toHaveProperty("appointmentId");
		expect(mockServiceRepository.findById).toHaveBeenCalledWith(
			service.id.toString(),
		);
		expect(mockAnimalRepository.findById).toHaveBeenCalledWith(
			animal.id.toString(),
		);
		expect(mockRulesExecutionService.execute).toHaveBeenCalledWith(
			animal,
			service.rules || [],
		);
		expect(
			mockAppointmentAvailabilityService.getAvailability,
		).toHaveBeenCalledWith(
			service.companyId.toString(),
			futureDate,
			65, // 60 + 5 from rules
		);
		expect(mockAppointmentRepository.create).toHaveBeenCalled();
	});

	it("should not create appointment when service is not found", async () => {
		mockServiceRepository.findById.mockResolvedValueOnce(null);
		mockAnimalRepository.findById.mockResolvedValueOnce(makeAnimal());

		const result = await sut.execute({
			serviceId: "non-existent-service",
			animalId: "animal-id",
			clientId: "client-id",
			date: addMinutes(new Date(), 60),
			coatType: "short",
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
		expect(mockAppointmentRepository.create).not.toHaveBeenCalled();
	});

	it("should not create appointment when animal is not found", async () => {
		mockServiceRepository.findById.mockResolvedValueOnce(makeService());
		mockAnimalRepository.findById.mockResolvedValueOnce(null);

		const result = await sut.execute({
			serviceId: "service-id",
			animalId: "non-existent-animal",
			clientId: "client-id",
			date: addMinutes(new Date(), 60),
			coatType: "short",
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
		expect(mockAppointmentRepository.create).not.toHaveBeenCalled();
	});

	it("should not create appointment when service is inactive", async () => {
		const service = makeService({ isActive: false });
		const animal = makeAnimal();

		mockServiceRepository.findById.mockResolvedValueOnce(service);
		mockAnimalRepository.findById.mockResolvedValueOnce(animal);

		const result = await sut.execute({
			serviceId: service.id.toString(),
			animalId: animal.id.toString(),
			clientId: "client-id",
			date: addMinutes(new Date(), 60),
			coatType: "short",
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(TimeSlotUnavailableError);
		expect((result.value as any).message).toBe("Serviço inativo");
		expect(mockAppointmentRepository.create).not.toHaveBeenCalled();
	});

	it("should not create appointment when date is in the past", async () => {
		const service = makeService({ isActive: true });
		const animal = makeAnimal();
		const pastDate = addMinutes(new Date(), -60);

		mockServiceRepository.findById.mockResolvedValueOnce(service);
		mockAnimalRepository.findById.mockResolvedValueOnce(animal);

		const result = await sut.execute({
			serviceId: service.id.toString(),
			animalId: animal.id.toString(),
			clientId: "client-id",
			date: pastDate,
			coatType: "short",
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(TimeSlotUnavailableError);
		expect((result.value as any).message).toBe("Data passada não permitida");
		expect(mockAppointmentRepository.create).not.toHaveBeenCalled();
	});

	it("should not create appointment when time slot is unavailable", async () => {
		const service = makeService({ isActive: true, price: 100, duration: 60 });
		const animal = makeAnimal();
		const futureDate = addMinutes(new Date(), 60);

		mockServiceRepository.findById.mockResolvedValueOnce(service);
		mockAnimalRepository.findById.mockResolvedValueOnce(animal);
		mockRulesExecutionService.execute.mockReturnValueOnce({
			price: 10,
			durationMinutes: 5,
		});
		mockAppointmentAvailabilityService.getAvailability.mockResolvedValueOnce({
			isValid: false,
			staffChoiced: null,
		});

		const result = await sut.execute({
			serviceId: service.id.toString(),
			animalId: animal.id.toString(),
			clientId: "client-id",
			date: futureDate,
			coatType: "short",
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(TimeSlotUnavailableError);
		expect((result.value as any).message).toBe("Horário indisponível");
		expect(mockAppointmentRepository.create).not.toHaveBeenCalled();
	});

	it("should calculate correct price with rules execution", async () => {
		const service = makeService({ isActive: true, price: 100, duration: 60 });
		const animal = makeAnimal();
		const staff = makeStaff();
		const futureDate = addMinutes(new Date(), 60);

		mockServiceRepository.findById.mockResolvedValueOnce(service);
		mockAnimalRepository.findById.mockResolvedValueOnce(animal);
		mockRulesExecutionService.execute.mockReturnValueOnce({
			price: 25,
			durationMinutes: 10,
		});
		mockAppointmentAvailabilityService.getAvailability.mockResolvedValueOnce({
			isValid: true,
			staffChoiced: staff,
		});
		mockAppointmentRepository.create.mockResolvedValueOnce(undefined);

		const result = await sut.execute({
			serviceId: service.id.toString(),
			animalId: animal.id.toString(),
			clientId: "client-id",
			date: futureDate,
			coatType: "short",
		});

		expect(result.isRight()).toBe(true);
		expect(
			mockAppointmentAvailabilityService.getAvailability,
		).toHaveBeenCalledWith(
			service.companyId.toString(),
			futureDate,
			70, // 60 + 10 from rules
		);
	});
});
