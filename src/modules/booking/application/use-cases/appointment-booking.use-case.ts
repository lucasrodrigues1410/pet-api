import { Injectable } from "@nestjs/common";
import { addMinutes, format, isBefore } from "date-fns";
import { ptBR } from "date-fns/locale";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { AnimalRepository } from "@/modules/animal/domain/repositories/animal.repository";
import { CreateAppointmentEvent } from "@/modules/notification/domain/events/create-appointment.event";
import { NotificationPublisher } from "@/modules/notification/domain/interfaces/notification-publisher.interface";
import { CreatePaymentUseCase } from "@/modules/payment/application/use-cases/create-payment.use-case";
import { ServiceRepository } from "@/modules/service/domain/repositories/service.repository";
import { StaffRepository } from "@/modules/staff/domain/repositories/staff.repository";
import { UserRepository } from "@/modules/user/domain/repositories/user.repository";
import { Either, left, right } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import {
	Appointment,
	CoatType,
} from "../../../appointment/domain/entities/appointment.entity";
import { AppointmentRepository } from "../../../appointment/domain/repositories/appointment.repository";
import { NotPossibleCompleteAppointmentError } from "../errors/not-possible-comple-appointment";
import { TimeSlotUnavailableError } from "../errors/time-slot-unavailable.error";
import { RulesExecutionService } from "../services/rules-execution.service";

interface AppointmentBookingUseCaseRequest {
	serviceId: string;
	animalId: string;
	clientId: string;
	startDate: Date;
	coatType: CoatType;
	disease?: string;
}

type AppointmentBookingUseCaseResponse = Either<
	| ResourceNotFoundError
	| TimeSlotUnavailableError
	| NotPossibleCompleteAppointmentError,
	{ appointmentId: string; clientSecret?: string; checkoutUrl?: string }
>;

@Injectable()
export class AppointmentBookingUseCase {
	constructor(
		private readonly staffRespository: StaffRepository,
		private readonly serviceRepository: ServiceRepository,
		private readonly userRepository: UserRepository,
		private readonly animalRepository: AnimalRepository,
		private readonly appointmentRepository: AppointmentRepository,
		private readonly createPaymentUseCase: CreatePaymentUseCase,
		private readonly notifyPublisher: NotificationPublisher,
		private readonly rulesExecution: RulesExecutionService,
	) {}

	async execute({
		serviceId,
		clientId,
		animalId,
		startDate,
		coatType,
		disease,
	}: AppointmentBookingUseCaseRequest): Promise<AppointmentBookingUseCaseResponse> {
		const now = new Date();
		if (isBefore(startDate, now)) {
			return left(new TimeSlotUnavailableError("Data passada não permitida"));
		}

		const [service, animal, user] = await Promise.all([
			this.serviceRepository.findByIdWithCompanyLocation(serviceId),
			this.animalRepository.findById(animalId),
			this.userRepository.findById(clientId),
		]);

		if (!service || !animal || !service.isActive || !user) {
			return left(new ResourceNotFoundError());
		}
		const ruleExecutionResult = await this.rulesExecution.execute(
			animal,
			service.rules,
			disease,
			coatType,
		);
		if ("action" in ruleExecutionResult) {
			return left(
				new NotPossibleCompleteAppointmentError(
					"Serviço indisponível para o animal com as características informadas.",
				),
			);
		}

		const endDate = addMinutes(
			startDate,
			service.duration + (ruleExecutionResult?.durationMinutes ?? 0),
		);
		const staffAvailable = await this.staffRespository.findAvailableForSlot(
			service.companyId.toString(),
			{ startDate, endDate },
		);
		if (!staffAvailable) {
			return left(new TimeSlotUnavailableError("Horário indisponível"));
		}

		const appointmentIntent = Appointment.create({
			serviceId: service.id,
			staffId: new UniqueEntityID(staffAvailable.id),
			animalId: animal.id,
			clientId: user.id,
			companyId: service.companyId,
			startDate,
			endDate,
			price: service.price + (ruleExecutionResult?.price ?? 0),
			coatType,
		});

		await this.appointmentRepository.create(appointmentIntent);
		let checkoutUrl: string | undefined;
		if (service.requiresPayment) {
			const paymentResult = await this.createPaymentUseCase.execute({
				appointmentId: appointmentIntent.id.toString(),
				amountCents: appointmentIntent.price,
				serviceName: service.name,
				serviceDescription: `Agendamento para ${animal.name} às ${startDate.toLocaleString()}`,
				companyImage: service.company.logo?.url,
			});
			if (paymentResult.isLeft()) return left(paymentResult.value);
			checkoutUrl = paymentResult.value.url;
		} else {
			await this.notifyPublisher.dispatch(
				new CreateAppointmentEvent(clientId, user.email, {
					clientName: animal.name,
					companyAddress: `${service.location.addressLine}, ${service.location.number} - ${service.location.city}`,
					companyName: service.company.name,
					date: `${format(startDate, "EEEE, d 'de' MMMM 'de' yyyy, HH:mm")} - ${format(endDate, "HH:mm")}`,
					price: appointmentIntent.price,
					detailsLink: `${process.env.APP_URL}/appointments/${appointmentIntent.id.toString()}`,
					professionalName: staffAvailable.name,
				}),
			);
		}
		return right({
			appointmentId: appointmentIntent.id.toString(),
			checkoutUrl: checkoutUrl,
		});
	}
}
