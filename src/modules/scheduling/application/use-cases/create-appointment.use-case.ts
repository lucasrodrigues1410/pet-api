import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found.error";
import { CalculatePriceVariationUseCase } from "@/modules/price-variation/application/use-cases/calculate-price-variation.use-case";
import { ServiceRepository } from "@/modules/service/domain/repositories/service.repository";
import { Injectable } from "@nestjs/common";
import { Appointment } from "../../domain/entities/appointment.entity";
import { AppointmentRepository } from "../../domain/repositories/appointment.repository";
import { AppointmentAvailabilityService } from "../services/appointment-availability.service";
import { TimeSlotUnavailableError } from "../errors/time-slot-unavailable.error";
import { NoApplicablePriceVariationError } from "@/modules/price-variation/domain/errors/no-applicable-price-variation.error";
import { CheckoutSessionCreationError } from "@/modules/payment/domain/errors/checkout-session-creation-error";
import { addMinutes } from "date-fns";
import { PaymentProcessorService } from "@/modules/payment/application/services/payment-processor.service";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

interface CreateAppointmentUseCaseRequest {
	serviceId: string;
	animalId: string;
	userId: string;
	date: Date;
}

type CreateAppointmentUseCaseResponse = Either<
	| ResourceNotFoundError
	| TimeSlotUnavailableError
	| NoApplicablePriceVariationError
	| CheckoutSessionCreationError,
	{ url: string }
>;

@Injectable()
export class CreateAppointmentUseCase {
	constructor(
		private readonly appointmentAvailabilityService: AppointmentAvailabilityService,
		private readonly serviceRepository: ServiceRepository,
		private readonly paymentProcessor: PaymentProcessorService,
		private readonly calculatePriceVariation: CalculatePriceVariationUseCase,
		private readonly appointmentRepository: AppointmentRepository,
	) {}

	async execute({
		serviceId,
		userId,
		animalId,
		date,
	}: CreateAppointmentUseCaseRequest): Promise<CreateAppointmentUseCaseResponse> {
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

		const appointmentId = new UniqueEntityID();

		// TODO: Implementar o UnitOfWork para garantir a atomicidade das operações
		const { paymentId, intent } = await this.paymentProcessor.process({
			items: [
				{
					name: service.name,
					amount: priceResult.value.price,
					quantity: 1,
					description: service.description || "",
				},
			],
			metadata: {
				appointmentId: appointmentId.toString(),
			},
			successUrl: `${process.env.APP_URL}/appointments/${appointmentId.toString()}`,
			payerId: userId,
		});

		// Cria o agendamento
		await this.appointmentRepository.create(
			Appointment.create(
				{
					animalId,
					paymentId: paymentId,
					clientId: userId,
					companyId: service.companyId.toString(),
					startDate,
					endDate,
					serviceId: service.id.toString(),
					priceAtScheduling: priceResult.value.price,
				},
				appointmentId,
			),
		);

		if (intent.isLeft()) {
			return left(intent.value);
		}

		return right({
			url: intent.value.url,
		});
	}
}
