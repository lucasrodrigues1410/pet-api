import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { AppointmentAvailabilityService } from "@/modules/appointment/application/services/appointment-availability.service";
import { CheckoutSessionCreationError } from "@/modules/payment/domain/errors/checkout-session-creation.error";
import { CalculatePriceVariationUseCase } from "@/modules/price-variation/application/use-cases/calculate-price-variation.use-case";
import { ServiceRepository } from "@/modules/service/domain/repositories/service.repository";
import { Either, left, right } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { Injectable } from "@nestjs/common";
import { addMinutes, isBefore } from "date-fns";
import { AppointmentRepository } from "../../domain/repositories/appointment.repository";
import { Appointment } from "../../domain/entities/appointment.entity";
import { TimeSlotUnavailableError } from "../errors/time-slot-unavailable.error";
import { InvalidAppointmentDateError } from "../errors/invalid-appointment-date.error";

interface AppointmentBookingUseCaseRequest {
	serviceId: string;
	animalId: string;
	clientId: string;
	date: Date;
}

type AppointmentBookingUseCaseResponse = Either<
	| ResourceNotFoundError
	| TimeSlotUnavailableError
	| CheckoutSessionCreationError
	| InvalidAppointmentDateError,
	{
		appointmentId: string;
	}
>;

@Injectable()
export class AppointmentBookingUseCase {
	constructor(
		private readonly appointmentAvailabilityService: AppointmentAvailabilityService,
		private readonly serviceRepository: ServiceRepository,
		private readonly calculatePriceVariation: CalculatePriceVariationUseCase,
		private readonly appointmentRepository: AppointmentRepository,
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
		const isAvailable =
			await this.appointmentAvailabilityService.getAvailability(
				service.companyId.toString(),
				serviceId,
				startDate,
				serviceDuration,
			);
		if (!isAvailable) {
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

		const appointmentIntent = Appointment.create({
			serviceId: new UniqueEntityID(serviceId),
			clientId: new UniqueEntityID(clientId),
			animalId: new UniqueEntityID(animalId),
			startDate,
			endDate,
			price: priceResult.value.price + service.price,
		});

		await this.appointmentRepository.create(appointmentIntent);
		return right({
			appointmentId: appointmentIntent.id.toString(),
		});
	}
}
