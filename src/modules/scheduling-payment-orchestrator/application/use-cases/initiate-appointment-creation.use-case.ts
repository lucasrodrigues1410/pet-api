import { Either, left, right } from "@/core/either";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found.error";
import { CheckoutSessionCreationError } from "@/modules/payment/domain/errors/checkout-session-creation-error";
import { CalculatePriceVariationUseCase } from "@/modules/price-variation/application/use-cases/calculate-price-variation.use-case";
import { NoApplicablePriceVariationError } from "@/modules/price-variation/domain/errors/no-applicable-price-variation.error";
import { ServiceRepository } from "@/modules/service/domain/repositories/service.repository";
import { Injectable } from "@nestjs/common";
import { addMinutes } from "date-fns";
import { PaymentService } from "@/modules/payment/application/services/payment-service";
import { TimeSlotUnavailableError } from "@/modules/appointment/application/errors/time-slot-unavailable.error";
import { AppointmentAvailabilityService } from "@/modules/appointment/application/services/appointment-availability.service";
import { AppointmentIntentRepository } from "@/modules/appointment/domain/repositories/appointment-intent.repository";
import { AppointmentIntent } from "@/modules/appointment/domain/entities/appointment-intent.entity";

interface InitiateAppointmentCreationUseCaseRequest {
	serviceId: string;
	animalId: string;
	clientId: string;
	date: Date;
}

type InitiateAppointmentCreationUseCaseResponse = Either<
	| ResourceNotFoundError
	| TimeSlotUnavailableError
	| NoApplicablePriceVariationError
	| CheckoutSessionCreationError,
	{ url: string }
>;

@Injectable()
export class InitiateAppointmentCreationUseCase {
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
	}: InitiateAppointmentCreationUseCaseRequest): Promise<InitiateAppointmentCreationUseCaseResponse> {
		// Valida existência do serviço
		const service = await this.serviceRepository.findById(serviceId);
		if (!service) {
			return left(new ResourceNotFoundError("Service"));
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
			return left(new TimeSlotUnavailableError());
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
