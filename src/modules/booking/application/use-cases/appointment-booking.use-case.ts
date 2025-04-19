import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { AnimalRepository } from "@/modules/animal/domain/repositories/animal.repository";
import { CheckoutSessionCreationError } from "@/modules/payment/domain/errors/checkout-session-creation.error";
import { PriceCalculator } from "@/modules/price-variation/application/services/price-calculator.service";
import { VariationType } from "@/modules/price-variation/domain/entities/price-variation.entity";
import { ServiceRepository } from "@/modules/service/domain/repositories/service.repository";
import { Either, left, right } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { Injectable } from "@nestjs/common";
import { addMinutes } from "date-fns";
import {
	Appointment,
} from "../../../appointment/domain/entities/appointment.entity";
import { AppointmentRepository } from "../../../appointment/domain/repositories/appointment.repository";
import { TimeSlotUnavailableError } from "../errors/time-slot-unavailable.error";
import { AppointmentAvailabilityService } from "../services/appointment-availability.service";
import { CoatType } from "@/modules/appointment/domain/enums/appointment.enum";

interface AppointmentBookingUseCaseRequest {
	serviceId: string;
	animalId: string;
	clientId: string;
	date: Date;
	coatType: CoatType;
}

type AppointmentBookingUseCaseResponse = Either<
	| ResourceNotFoundError
	| TimeSlotUnavailableError
	| CheckoutSessionCreationError,
	{
		appointmentId: string;
	}
>;

@Injectable()
export class AppointmentBookingUseCase {
	constructor(
		private readonly appointmentAvailabilityService: AppointmentAvailabilityService,
		private readonly serviceRepository: ServiceRepository,
		private readonly priceCalculator: PriceCalculator,
		private readonly animalRepository: AnimalRepository,
		private readonly appointmentRepository: AppointmentRepository,
	) {}

	async execute({
		serviceId,
		clientId,
		animalId,
		date,
		coatType,
	}: AppointmentBookingUseCaseRequest): Promise<AppointmentBookingUseCaseResponse> {
		// Valida existência do serviço
		const service = await this.serviceRepository.findById(serviceId);
		if (!service) {
			return left(new ResourceNotFoundError("Serviço não encontrado"));
		}

		// Valida existência do animal
		const animal = await this.animalRepository.findById(animalId);
		if (!animal) {
			return left(new ResourceNotFoundError("Animal não encontrado"));
		}

		const startDate = new Date(date);
		const serviceDuration = service.duration || 0;
		const endDate = addMinutes(startDate, serviceDuration);

		// Verifica se o horário está disponível
		const available = await this.appointmentAvailabilityService.getAvailability(
			service.companyId.toString(),
			startDate,
			serviceDuration,
		);
		if (!available.isValid || !available.staffChoiced) {
			return left(new TimeSlotUnavailableError("Horário indisponível"));
		}

		// Calcula variação de preço
		const price = await this.priceCalculator.calculate(service.id.toString(), [
			{ type: VariationType.SIZE, value: animal.weight ?? 0 },
		]);

		const appointmentIntent = Appointment.create({
			serviceId: new UniqueEntityID(serviceId),
			staffId: available.staffChoiced.id,
			animalId: new UniqueEntityID(animalId),
			clientId: new UniqueEntityID(clientId),
			companyId: service.companyId,
			startDate,
			endDate,
			price: price + service.price,
			coatType,
		});

		await this.appointmentRepository.create(appointmentIntent);
		return right({
			appointmentId: appointmentIntent.id.toString(),
		});
	}
}
