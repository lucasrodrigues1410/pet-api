import { beforeEach, describe, expect, it } from "bun:test";
import { daysOfWeek } from "@/modules/company-availability/domain/entities/company-availability.entity";
import { CreateCheckoutSessionUseCase } from "@/modules/payment/application/use-cases/create-checkout-session.use-case";
import { PaymentGatewayRepository } from "@/modules/payment/domain/repositories/payment-gateway.repository";
import { CalculatePriceVariationUseCase } from "@/modules/price-variation/application/use-cases/calculate-price-variation.use-case";
import { set } from "date-fns";
import { makeAnimal } from "test/factories/make-animal";
import { makeCompany } from "test/factories/make-company";
import { makeCompanyAvailability } from "test/factories/make-company-availability";
import { makePriceVariation } from "test/factories/make-price-variation";
import { makeService } from "test/factories/make-service";
import { makeUser } from "test/factories/make-user";
import { PaymentGatewayMock } from "test/gateways/payment-gateway-mock.gateway";
import { MockPriceStrategyProvider } from "test/providers/price-strategy.provider";
import { InMemoryAnimalRepository } from "test/repositories/in-memory-animal.repository";
import { InMemoryAppointmentRepository } from "test/repositories/in-memory-appointment.repository";
import { InMemoryCompanyAvailabilityExceptionRepository } from "test/repositories/in-memory-company-availability-exception.repository";
import { InMemoryCompanyAvailabilityRepository } from "test/repositories/in-memory-company-availability.repository";
import { InMemoryPaymentRepository } from "test/repositories/in-memory-payment.repository";
import { InMemoryPriceVariationRepository } from "test/repositories/in-memory-price-variation.repository";
import { InMemoryServiceRepository } from "test/repositories/in-memory-service.repository";
import { AppointmentAvailabilityService } from "../services/appointment-availability.service";
import { CreateAppointmentUseCase } from "./create-appointment.use-case";

// Declaração das variáveis já fornecidas
let inMemoryAppointmentRepository: InMemoryAppointmentRepository;
let inMemoryCompanyAvailabilityRepo: InMemoryCompanyAvailabilityRepository;
let inMemoryCompanyAvailabilityExceptionRepo: InMemoryCompanyAvailabilityExceptionRepository;
let inMemoryServiceRepository: InMemoryServiceRepository;
let inMemoryAnimalRepository: InMemoryAnimalRepository;
let inMemoryPriceVariationRepository: InMemoryPriceVariationRepository;
let strategyProvider: MockPriceStrategyProvider;
let inMemoryPaymentRepository: InMemoryPaymentRepository;
let mockPaymentGateway: PaymentGatewayRepository;

let appointmentAvailabilityService: AppointmentAvailabilityService;
let createCheckoutSession: CreateCheckoutSessionUseCase;
let calculatePriceVariation: CalculatePriceVariationUseCase;

let sut: CreateAppointmentUseCase;

describe("CreateAppointmentUseCase", () => {
	// Ajustei o nome do describe para refletir o use case correto
	beforeEach(() => {
		inMemoryAppointmentRepository = new InMemoryAppointmentRepository();
		inMemoryCompanyAvailabilityRepo =
			new InMemoryCompanyAvailabilityRepository();
		inMemoryCompanyAvailabilityExceptionRepo =
			new InMemoryCompanyAvailabilityExceptionRepository();
		inMemoryServiceRepository = new InMemoryServiceRepository();
		inMemoryAnimalRepository = new InMemoryAnimalRepository();
		inMemoryPriceVariationRepository = new InMemoryPriceVariationRepository();
		strategyProvider = new MockPriceStrategyProvider();
		inMemoryPaymentRepository = new InMemoryPaymentRepository();
		mockPaymentGateway = new PaymentGatewayMock();

		appointmentAvailabilityService = new AppointmentAvailabilityService(
			inMemoryAppointmentRepository,
			inMemoryCompanyAvailabilityRepo,
			inMemoryCompanyAvailabilityExceptionRepo,
		);

		calculatePriceVariation = new CalculatePriceVariationUseCase(
			inMemoryAnimalRepository,
			inMemoryPriceVariationRepository,
			strategyProvider,
		);

		createCheckoutSession = new CreateCheckoutSessionUseCase(
			inMemoryPaymentRepository,
			mockPaymentGateway,
		);

		sut = new CreateAppointmentUseCase(
			appointmentAvailabilityService,
			inMemoryServiceRepository,
			createCheckoutSession,
			calculatePriceVariation,
			inMemoryAppointmentRepository,
		);
	});

	// Teste de Sucesso
	it("deve criar um agendamento com sucesso", async () => {
		const company = makeCompany();
		const user = makeUser();
		const animal = makeAnimal({ userId: user.id, weight: 5 });
		const service = makeService({ companyId: company.id });
		const priceVariation = makePriceVariation({
			serviceId: service.id,
			variation: "SIZE",
			price: 100,
			value: "SMALL",
		});

		const today = set(new Date(), { hours: 8, minutes: 20, seconds: 0 });
		const dayOfWeek = daysOfWeek[today.getDay()];

		// Arrange
		const appointmentData = {
			serviceId: service.id.toString(),
			animalId: animal.id.toString(),
			date: today,
			userId: user.id.toString(),
			companyId: company.id.toString(),
		};

		inMemoryPriceVariationRepository.items.push(priceVariation);
		inMemoryServiceRepository.items.push(service);
		inMemoryAnimalRepository.items.push(animal);
		inMemoryCompanyAvailabilityRepo.items.push(
			makeCompanyAvailability({ companyId: company.id, day: dayOfWeek }),
		);
		// // Act
		const result = await sut.execute(appointmentData);
		// Assert
		expect(result.isRight()).toBe(true);
		expect(inMemoryAppointmentRepository.items).toHaveLength(1);
		expect(inMemoryPaymentRepository.items).toHaveLength(1);
		expect(inMemoryAppointmentRepository.items[0].priceAtScheduling).toBe(100);
	});
});
