import { beforeEach, describe, jest } from "bun:test";
import { AppointmentAvailabilityService } from "@/modules/appointment/application/services/appointment-availability.service";
import { PaymentService } from "@/modules/payment/application/services/payment-service";
import { CalculatePriceVariationUseCase } from "@/modules/price-variation/application/use-cases/calculate-price-variation.use-case";
import { Either, right } from "@/shared/either";
import { MockPriceStrategyProvider } from "test/providers/price-strategy.provider";
import { InMemoryAnimalRepository } from "test/repositories/in-memory-animal.repository";
import { InMemoryAppointmentIntentRepository } from "test/repositories/in-memory-appointment.repository";
import { InMemoryPriceVariationRepository } from "test/repositories/in-memory-price-variation.repository";
import { InMemoryServiceRepository } from "test/repositories/in-memory-service.repository";
import { AppointmentBookingUseCase } from "./appointment-booking.use-case";

//PriceVariationUseCase
let inMemoryPriceVariationRepository: InMemoryPriceVariationRepository;
let inMemoryAnimalRepository: InMemoryAnimalRepository;
let mockPriceStrategyFactory: MockPriceStrategyProvider;

let appointmentAvailabilityService: AppointmentAvailabilityService;
let serviceRepository: InMemoryServiceRepository;
let calculatePriceVariation: CalculatePriceVariationUseCase;
let appointmentIntentRepository: InMemoryAppointmentIntentRepository;
let paymentService: PaymentService;

let sut: AppointmentBookingUseCase;

describe("AppointmentBookingUseCase", () => {
	beforeEach(() => {
		//PriceVariationUseCase
		inMemoryPriceVariationRepository = new InMemoryPriceVariationRepository();
		inMemoryAnimalRepository = new InMemoryAnimalRepository();
		mockPriceStrategyFactory = new MockPriceStrategyProvider();

		//

		appointmentAvailabilityService = {} as AppointmentAvailabilityService;
		serviceRepository = new InMemoryServiceRepository();
		appointmentIntentRepository = new InMemoryAppointmentIntentRepository();
		paymentService = {} as PaymentService;
		calculatePriceVariation = new CalculatePriceVariationUseCase(
			inMemoryAnimalRepository,
			inMemoryPriceVariationRepository,
			mockPriceStrategyFactory,
		);

		sut = new AppointmentBookingUseCase(
			appointmentAvailabilityService,
			serviceRepository,
			calculatePriceVariation,
			appointmentIntentRepository,
			paymentService,
		);
	});
});
