import { Injectable } from "@nestjs/common";
import { endOfDay, getDay, startOfDay } from "date-fns";
import { AppointmentRepository } from "@/modules/appointment/domain/repositories/appointment.repository";
import { daysOfWeek } from "@/modules/company-availability/domain/entities/company-availability.entity";
import { CompanyAvailabilityRepository } from "@/modules/company-availability/domain/repositories/company-availability.repository";
import { ServiceRepository } from "@/modules/service/domain/repositories/service.repository";
import { StaffRepository } from "@/modules/staff/domain/repositories/staff.repository";
import { Either, left, right } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { TimeSlot } from "../../domain/entities/time-slot.entity";
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
	constructor(
		private readonly companyAvailability: CompanyAvailabilityRepository,
		private readonly serviceRepository: ServiceRepository,
		private readonly appointmentRepository: AppointmentRepository,
		private readonly staffRepo: StaffRepository,
	) {}

	async execute({
		companyId,
		serviceId,
		date,
	}: ListAvailableDatesUseCaseRequest): Promise<ListAvailableDatesUseCaseResponse> {
		const dayOfWeek = daysOfWeek[getDay(date)];
		const startDate = startOfDay(date);
		const endDate = endOfDay(date);

		const service = await this.serviceRepository.findById(serviceId);
		if (!service || !service.isActive) {
			return left(new ResourceNotFoundError("Serviço não encontrado"));
		}

		const [companyAvailability, appointments, totalStaff] = await Promise.all([
			this.companyAvailability.findByCompanyIdAndDayOfWeek(
				companyId,
				dayOfWeek,
			),
			this.appointmentRepository.getByPeriodAndCompanyId({
				companyId,
				range: { startDate, endDate },
			}),
			this.staffRepo.totalStaffByCompanyId(companyId),
		]);

		if (!companyAvailability) {
			return left(
				new ResourceNotFoundError("Disponibilidade da empresa não encontrada"),
			);
		}

		// Gera os time slots possíveis
		const timeSlots = TimeSlotGeneratorService.generateTimeSlots(
			companyAvailability.timeRange,
			companyAvailability.launchTime,
			service.duration || 0,
			date,
		);

		// Filtra os slots disponíveis
		const availableSlots = AvailableSlotsService.getAvailableSlots({
			slots: timeSlots,
			duration: service.duration || 0,
			appointments,
			totalStaff,
		});
		return right({ slots: availableSlots });
	}
}
