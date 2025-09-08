import { Injectable } from "@nestjs/common";
import { addMinutes } from "date-fns";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { AnimalRepository } from "@/modules/animal/domain/repositories/animal.repository";
import { ServiceRepository } from "@/modules/service/domain/repositories/service.repository";
import { Either, left, right } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import {
	Appointment,
	CoatType,
} from "../../../appointment/domain/entities/appointment.entity";
import { AppointmentRepository } from "../../../appointment/domain/repositories/appointment.repository";
import { TimeSlotUnavailableError } from "../errors/time-slot-unavailable.error";
import { AppointmentAvailabilityService } from "../services/appointment-availability.service";
import { RulesExecutionService } from "../services/rules-execution.service";

interface AppointmentBookingUseCaseRequest {
	serviceId: string;
	animalId: string;
	clientId: string;
	date: Date;
	coatType: CoatType;
}

type AppointmentBookingUseCaseResponse = Either<
	ResourceNotFoundError | TimeSlotUnavailableError,
	{
		appointmentId: string;
	}
>;

@Injectable()
export class AppointmentBookingUseCase {
	constructor(
		private readonly appointmentAvailabilityService: AppointmentAvailabilityService,
		private readonly serviceRepository: ServiceRepository,
		private readonly rulesExecution: RulesExecutionService,
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
		const [service, animal] = await Promise.all([
			this.serviceRepository.findById(serviceId),
			this.animalRepository.findById(animalId),
		]);
		if (!service || !animal) {
			return left(new ResourceNotFoundError());
		}

		// Validações de negócio básicas
		if (!service.isActive) {
			return left(new TimeSlotUnavailableError("Serviço inativo"));
		}

		const startDate = new Date(date);
		const now = new Date();
		if (startDate <= now) {
			return left(new TimeSlotUnavailableError("Data passada não permitida"));
		}

		// Calcula variação de preço
		const ruleExecutionResult = await this.rulesExecution.execute(
			animal,
			service.rules || [],
		);

		const basePrice = service.price;
		const priceAdjustment = ruleExecutionResult?.price ?? 0;
		const totalPrice = basePrice + priceAdjustment;

		const baseDurationMinutes = service.duration;
		const finalDurationMinutes = baseDurationMinutes + (ruleExecutionResult?.durationMinutes ?? 0);

		const endDate = addMinutes(startDate, finalDurationMinutes);
		// Verifica se o horário está disponível
		const available = await this.appointmentAvailabilityService.getAvailability(
			service.companyId.toString(),
			startDate,
			finalDurationMinutes,
		);
		if (!available.isValid || !available.staffChoiced) {
			return left(new TimeSlotUnavailableError("Horário indisponível"));
		}

		const appointmentIntent = Appointment.create({
			serviceId: new UniqueEntityID(serviceId),
			staffId: available.staffChoiced.id,
			animalId: new UniqueEntityID(animalId),
			clientId: new UniqueEntityID(clientId),
			companyId: service.companyId,
			startDate,
			endDate,
			price: totalPrice,
			coatType,
		});

		await this.appointmentRepository.create(appointmentIntent);
		return right({
			appointmentId: appointmentIntent.id.toString(),
		});
	}
}
