import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found.error";
import { DaysOfWeek } from "@/modules/company-availability/domain/entities/company-availability.entity";
import { CompanyAvailabilityExcpetionRepository } from "@/modules/company-availability/domain/repositories/company-availability-exception.repository";
import { CompanyAvailabilityRepository } from "@/modules/company-availability/domain/repositories/company-availability.repository";
import { ServiceRepository } from "@/modules/service/domain/repositories/service.repository";
import { Injectable } from "@nestjs/common";
import { endOfDay, format, getDay, startOfDay } from "date-fns";
import { TimeSlot } from "../../domain/entities/time-slot.entity";
import { AppointmentIntentRepository } from "../../domain/repositories/appointment-intent.repository";
import { AppointmentRepository } from "../../domain/repositories/appointment.repository";
import { AvailableSlotsService } from "../services/available-slots.service";
import { TimeSlotGeneratorService } from "../services/time-slot-generator.service";

interface ListAvailableDatesUseCaseRequest {
	companyId: string;
	serviceId: string;
	date: Date;
}

type ListAvailableDatesUseCaseResponse = Either<
	ResourceNotFoundError | Error,
	{ slots: TimeSlot[] }
>;

@Injectable()
export class ListAvailableDatesUseCase {
	private timeSlotGenerator = new TimeSlotGeneratorService();
	private availableSlotsService = new AvailableSlotsService();

	constructor(
		private readonly appointmentRepository: AppointmentRepository,
		private readonly companyAvailability: CompanyAvailabilityRepository,
		private readonly companyAvailabilityException: CompanyAvailabilityExcpetionRepository,
		private readonly serviceRepository: ServiceRepository,
		private readonly appointmentIntentRepository: AppointmentIntentRepository,
	) {}

	async execute({
		companyId,
		serviceId,
		date,
	}: ListAvailableDatesUseCaseRequest): Promise<ListAvailableDatesUseCaseResponse> {
		const dayOfWeek = Object.values(DaysOfWeek)[getDay(date)];
		const startDate = startOfDay(date);
		const endDate = endOfDay(date);

		const [
			companyAvailability,
			companyAvailabilityExceptions,
			service,
			appointments,
			intents,
		] = await Promise.all([
			this.companyAvailability.findByCompanyIdAndDayOfWeek(
				companyId,
				dayOfWeek,
			),
			this.companyAvailabilityException.findExceptionsByCompanyAndPeriod(
				companyId,
				{
					startDate,
					endDate,
				},
			),
			this.serviceRepository.findById(serviceId),
			this.appointmentRepository.getByPeriod({
				serviceId,
				startDate,
				endDate,
			}),
			this.appointmentIntentRepository.findValidInRange({
				serviceId,
				startDate,
				endDate,
			}),
		]);

		if (!companyAvailability || !service) {
			return left(new ResourceNotFoundError());
		}

		if ((service?.duration ?? 0) <= 0) {
			return left(new Error("Service duration must be greater than 0"));
		}

		// Aqui podemos optar por gerar os slots mesmo se o horário do dia não estiver dentro do range,
		// mas se necessário, você pode verificar se a data atual está dentro do range da empresa.
		const isInRange =
			format(date, "HH:mm") >= companyAvailability.timeRange.startTime &&
			format(date, "HH:mm") <= companyAvailability.timeRange.endTime;
		if (!isInRange) {
			return right({
				slots: [],
			});
		}

		// Gera os possíveis time slots para o dia
		const timeSlots = this.timeSlotGenerator.generateTimeSlots(
			companyAvailability.timeRange.startTime,
			companyAvailability.timeRange.endTime,
			service.duration || 0,
			date,
		);

		// Filtra os slots removendo os que possuem agendamento ou exceção
		const availableSlots = this.availableSlotsService.filterAvailableSlots(
			timeSlots,
			service.duration || 0,
			[
				appointments.map((a) => ({
					startDate: a.startDate,
					endDate: a.endDate,
				})),
				intents.map((i) => ({
					startDate: i.startDate,
					endDate: i.endDate,
				})),
				(companyAvailabilityExceptions ?? []).map((exception) => ({
					startDate: exception.startDate,
					endDate: exception.endDate,
				})),
			],
		);

		return right({ slots: availableSlots });
	}
}
