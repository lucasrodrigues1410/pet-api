import { Injectable } from "@nestjs/common";
import { addMinutes, isBefore } from "date-fns";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { AnimalRepository } from "@/modules/animal/domain/repositories/animal.repository";
import { CreatePaymentUseCase } from "@/modules/payment/application/use-cases/create-payment.use-case";
import { ServiceRepository } from "@/modules/service/domain/repositories/service.repository";
import { StaffRepository } from "@/modules/staff/domain/repositories/staff.repository";
import { Either, left, right } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import {
	Appointment,
	CoatType,
} from "../../../appointment/domain/entities/appointment.entity";
import { AppointmentRepository } from "../../../appointment/domain/repositories/appointment.repository";
import { TimeSlotUnavailableError } from "../errors/time-slot-unavailable.error";
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
	{ appointmentId: string; clientSecret?: string; checkoutUrl?: string }
>;

@Injectable()
export class AppointmentBookingUseCase {
	constructor(
		private readonly staffRespository: StaffRepository,
		private readonly serviceRepository: ServiceRepository,
		private readonly rulesExecution: RulesExecutionService,
		private readonly animalRepository: AnimalRepository,
		private readonly appointmentRepository: AppointmentRepository,
		private readonly createPaymentUseCase: CreatePaymentUseCase,
	) {}

	async execute({
		serviceId,
		clientId,
		animalId,
		date,
		coatType,
	}: AppointmentBookingUseCaseRequest): Promise<AppointmentBookingUseCaseResponse> {
		const startDate = new Date(date);
		const now = new Date();
		if (isBefore(startDate, now)) {
			return left(new TimeSlotUnavailableError("Data passada não permitida"));
		}

		const [service, animal] = await Promise.all([
			this.serviceRepository.findById(serviceId),
			this.animalRepository.findById(animalId),
		]);

		if (!service || !animal || !service.isActive) {
			return left(new ResourceNotFoundError());
		}

		const ruleExecutionResult = await this.rulesExecution.execute(
			animal,
			service.rules || [],
		);

		const priceAdjustment = ruleExecutionResult?.price ?? 0;
		const finalDurationMinutes =
			service.duration + (ruleExecutionResult?.durationMinutes ?? 0);

		const endDate = addMinutes(startDate, finalDurationMinutes);
		const staffAvailable = await this.staffRespository.findAvailableForSlot(
			service.companyId.toString(),
			{ startDate: startDate, endDate: endDate },
		);
		if (!staffAvailable) {
			return left(new TimeSlotUnavailableError("Horário indisponível"));
		}

		const appointmentIntent = Appointment.create({
			serviceId: new UniqueEntityID(serviceId),
			staffId: staffAvailable,
			animalId: new UniqueEntityID(animalId),
			clientId: new UniqueEntityID(clientId),
			companyId: service.companyId,
			startDate,
			endDate,
			price: service.price + priceAdjustment,
			coatType,
		});

		await this.appointmentRepository.create(appointmentIntent);
		const paymentResult = await this.createPaymentUseCase.execute({
			appointmentId: appointmentIntent.id.toString(),
			amountCents: appointmentIntent.price,
			serviceName: service.name,
			serviceDescription: `Agendamento para ${animal.name} às ${startDate.toLocaleString()}`,
			companyImage: service.company.logo?.url,
		});

		if (paymentResult.isLeft()) {
			// TODO: rollback appointment
			return left(paymentResult.value);
		}

		return right({
			appointmentId: appointmentIntent.id.toString(),
			checkoutUrl: paymentResult.value.url,
		});
	}
}
