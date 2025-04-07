import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { TimeSlotUnavailableError } from "@/modules/scheduling-payment/application/errors/time-slot-unavailable.error";
import { InvalidAppointmentDateError } from "@/modules/scheduling-payment/application/errors/invalid-appointment-date.error";
import { AppointmentAvailabilityService } from "@/modules/appointment/application/services/appointment-availability.service";
import { AppointmentIntent } from "@/modules/appointment/domain/entities/appointment-intent.entity";
import { AppointmentIntentRepository } from "@/modules/appointment/domain/repositories/appointment-intent.repository";
import { PaymentService } from "@/modules/payment/application/services/payment-service";
import { CheckoutSessionCreationError } from "@/modules/payment/domain/errors/checkout-session-creation.error";
import { CalculatePriceVariationUseCase } from "@/modules/price-variation/application/use-cases/calculate-price-variation.use-case";
import { NoApplicablePriceVariationError } from "@/modules/price-variation/domain/errors/no-applicable-price-variation.error";
import { ServiceRepository } from "@/modules/service/domain/repositories/service.repository";
import { Either, left, right } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { Injectable } from "@nestjs/common";
import { addMinutes, isBefore } from "date-fns";

interface AppointmentBookingUseCaseRequest {
	serviceId: string;
	animalId: string;
	clientId: string;
	date: Date;
}

type AppointmentBookingUseCaseResponse = Either<
	| ResourceNotFoundError
	| TimeSlotUnavailableError
	| NoApplicablePriceVariationError
	| CheckoutSessionCreationError
	| InvalidAppointmentDateError,
	{ url: string }
>;

@Injectable()
export class AppointmentBookingUseCase {
	constructor(
		private readonly appointmentAvailabilityService: AppointmentAvailabilityService,
		private readonly serviceRepository: ServiceRepository,
		private readonly calculatePriceVariation: CalculatePriceVariationUseCase,
		private readonly appointmentIntentRepository: AppointmentIntentRepository,
		private readonly paymentService: PaymentService,
	) {}

	async execute({
		serviceId,
		clientId,
		animalId,
		date,
	}: AppointmentBookingUseCaseRequest): Promise<AppointmentBookingUseCaseResponse> {
		const today = new Date();
		if (isBefore(date, today)) {
			return left(new InvalidAppointmentDateError());
		}

		// Valida existência do serviço
		const service = await this.serviceRepository.findById(serviceId);
		if (!service) {
			return left(new ResourceNotFoundError("Serviço não encontrado"));
		}

		const startDate = new Date(date);
		const serviceDuration = service.duration || 0;
		const endDate = addMinutes(startDate, serviceDuration);

		// Verifica se o horário está disponível
		const { isAvailable, timeRange } =
			await this.appointmentAvailabilityService.getAvailability(
				service.companyId.toString(),
				serviceId,
				startDate,
				serviceDuration,
			);
		if (!isAvailable || !timeRange) {
			return left(new TimeSlotUnavailableError("Horário indisponível"));
		}

		// Calcula variação de preço
		const priceResult = await this.calculatePriceVariation.execute({
			animalId,
			serviceId,
		});
		if (priceResult.isLeft()) {
			return left(priceResult.value);
		}

		const appointmentIntent = AppointmentIntent.create({
			serviceId: new UniqueEntityID(serviceId),
			clientId: new UniqueEntityID(clientId),
			animalId: new UniqueEntityID(animalId),
			startDate,
			endDate,
			price: priceResult.value.price,
		});

		// Cria a intenção de agendamento
		await this.appointmentIntentRepository.create(appointmentIntent);

		// Cria a sessão de checkout
		const checkout = await this.paymentService.createCheckoutSession({
			items: [
				{
					name: service.name,
					amount: priceResult.value.price,
					quantity: 1,
					description: service.description || "",
				},
			],
			metadata: {
				appointmentIntentId: appointmentIntent.id.toString(),
			},
			successUrl: `${process.env.APP_URL}/appointments/${appointmentIntent.id.toString()}`,
		});

		if (checkout.isLeft()) {
			return left(checkout.value);
		}

		return right({
			url: checkout.value.url,
		});
	}
}
