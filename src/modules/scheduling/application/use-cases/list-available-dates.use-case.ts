import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found.error";
import { DaysOfWeek } from "@/modules/company-availability/domain/entities/company-availability.entity";
import { CompanyAvailabilityExcpetionRepository } from "@/modules/company-availability/domain/repositories/company-availability-exception.repository";
import { CompanyAvailabilityRepository } from "@/modules/company-availability/domain/repositories/company-availability.repository";
import { ServiceRepository } from "@/modules/service/domain/repositories/service.repository";
import { Injectable } from "@nestjs/common";
import {
	addMinutes,
	endOfDay,
	format,
	getDay,
	isBefore,
	isWithinInterval,
	startOfDay,
} from "date-fns";
import { AvailableDate } from "../../domain/entities/available-date.entity";
import { TimeSlot } from "../../domain/entities/time-slot.entity";
import { AppointmentRepository } from "../../domain/repositories/appointment.repository";

type ListAvailableDatesUseCaseResponse = Either<
	ResourceNotFoundError,
	{
		availableDate: AvailableDate;
	}
>;

@Injectable()
export class ListAvailableDatesUseCase {
	constructor(
		private appointmentRepository: AppointmentRepository,
		private companyAvailability: CompanyAvailabilityRepository,
		private companyAvailabilityException: CompanyAvailabilityExcpetionRepository,
		private serviceRepository: ServiceRepository,
	) {}

	async execute(
		companyId: string,
		serviceId: string,
		date: Date,
	): Promise<ListAvailableDatesUseCaseResponse> {
		const dayOfWeek = Object.values(DaysOfWeek)[getDay(date)];
		const startDate = startOfDay(date);
		const endDate = endOfDay(date);

		const [
			companyAvailability,
			companyAvailabilityExceptions,
			service,
			appointments,
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
			this.appointmentRepository.getAppointmentsByPeriod({
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

		const availableDate = AvailableDate.create({
			date,
			slots: [],
		});

		const isInRange =
			format(date, "HH:mm") >= companyAvailability.timeRange.startTime &&
			format(date, "HH:mm") <= companyAvailability.timeRange.endTime;

		if (!isInRange) {
			return right({ availableDate });
		}

		const timeSlots = this.generateTimeSlots(
			companyAvailability.timeRange.startTime,
			companyAvailability.timeRange.endTime,
			service.duration ?? 0,
			date,
		);

		const availableSlots = timeSlots.filter((slot) => {
			const slotEnd = addMinutes(slot, service.duration ?? 0);

			const hasAppointment = appointments.some((appointment) =>
				isWithinInterval(slotEnd, {
					start: new Date(appointment.startDate),
					end: new Date(appointment.endDate),
				}),
			);
			const hasException = companyAvailabilityExceptions?.some((exception) =>
				isWithinInterval(slotEnd, {
					start: new Date(exception.startDate),
					end: new Date(exception.endDate),
				}),
			);
			return !hasAppointment && !hasException;
		});

		for (const slot of availableSlots) {
			availableDate.addSlot(
				TimeSlot.create({
					label: format(slot, "HH:mm"),
				}),
			);
		}

		return right({ availableDate });
	}

	private generateTimeSlots(
		startTime: string,
		endTime: string,
		duration: number,
		baseDate: Date,
	): Date[] {
		const slots: Date[] = [];
		const [startHour, startMinute] = startTime.split(":").map(Number);
		const [endHour, endMinute] = endTime.split(":").map(Number);

		const start = new Date(baseDate);
		start.setHours(startHour, startMinute, 0, 0);

		const end = new Date(baseDate);
		end.setHours(endHour, endMinute, 0, 0);

		let currentSlot = start;
		while (isBefore(currentSlot, end)) {
			slots.push(new Date(currentSlot));
			currentSlot = addMinutes(currentSlot, duration);
		}

		return slots;
	}
}
