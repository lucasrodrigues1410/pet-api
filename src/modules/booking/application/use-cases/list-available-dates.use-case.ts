import { daysOfWeek } from "@/modules/company-availability/domain/entities/company-availability.entity";
import { CompanyAvailabilityExcpetionRepository } from "@/modules/company-availability/domain/repositories/company-availability-exception.repository";
import { CompanyAvailabilityRepository } from "@/modules/company-availability/domain/repositories/company-availability.repository";
import { ServiceRepository } from "@/modules/service/domain/repositories/service.repository";
import { Either, left, right } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { Injectable } from "@nestjs/common";
import { endOfDay, format, getDay, isValid, startOfDay } from "date-fns";
import { TimeSlot } from "../../domain/entities/time-slot.entity";
import { AvailableSlotsService } from "../services/available-slots.service";
import { TimeSlotGeneratorService } from "../services/time-slot-generator.service";
import { StaffRepository } from "@/modules/staff/domain/repositories/staff.repository";

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
	private readonly timeSlotGenerator = new TimeSlotGeneratorService();
	private readonly availableSlotsService = new AvailableSlotsService();

	constructor(
		private readonly companyAvailability: CompanyAvailabilityRepository,
		private readonly companyAvailabilityException: CompanyAvailabilityExcpetionRepository,
		private readonly serviceRepository: ServiceRepository,
		private readonly staffRepo: StaffRepository,
	) {}

	async execute({
		companyId,
		serviceId,
		date,
	}: ListAvailableDatesUseCaseRequest): Promise<ListAvailableDatesUseCaseResponse> {
		if (!companyId || !serviceId || !date || !isValid(date)) {
			return left(
				new Error("Parâmetros inválidos: companyId, serviceId ou date"),
			);
		}

		const dayOfWeek = daysOfWeek[getDay(date)];
		const startDate = startOfDay(date);
		const endDate = endOfDay(date);

		const service = await this.serviceRepository.findById(serviceId);
		if (!service) {
			return left(new ResourceNotFoundError("Serviço não encontrado"));
		}

		const [companyAvailability, companyAvailabilityExceptions, staffMembers] =
			await Promise.all([
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
				this.staffRepo.fetchCompanyStaffWithAppointmentsInDateRange(companyId, {
					startDate,
					endDate,
				}),
			]);

		if (!companyAvailability) {
			return left(
				new ResourceNotFoundError("Disponibilidade da empresa não encontrada"),
			);
		}
		// Verifica se a data está no intervalo de operação da empresa
		const { startTime, endTime } = companyAvailability.timeRange;
		const isDateInRange = this.isDateWithinRange(date, startTime, endTime);
		if (!isDateInRange) {
			return right({ slots: [] });
		}

		// Gera os time slots possíveis
		const timeSlots = this.timeSlotGenerator.generateTimeSlots(
			companyAvailability.timeRange,
			service.duration || 0,
			date,
		);

		// Filtra os slots disponíveis
		const availableSlots = this.availableSlotsService.filterAvailableSlots({
			slots: timeSlots,
			duration: service.duration || 0,
			staffsData: staffMembers.map((staff) => ({
				staffId: staff.id.toString(),
				unavailablePeriods: staff.appointments ?? [],
			})),
			companyExceptions: companyAvailabilityExceptions ?? [],
			launchTime: companyAvailability.launchTime,
		});

		return right({ slots: availableSlots });
	}

	private isDateWithinRange(
		date: Date,
		startTime: string,
		endTime: string,
	): boolean {
		const formattedDate = format(date, "HH:mm");
		return formattedDate >= startTime && formattedDate <= endTime;
	}
}
