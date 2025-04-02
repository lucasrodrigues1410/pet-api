import { daysOfWeek } from "@/modules/company-availability/domain/entities/company-availability.entity";
import { CompanyAvailabilityExcpetionRepository } from "@/modules/company-availability/domain/repositories/company-availability-exception.repository";
import { CompanyAvailabilityRepository } from "@/modules/company-availability/domain/repositories/company-availability.repository";
import { Injectable } from "@nestjs/common";
import { addMinutes } from "date-fns";
import { AppointmentRepository } from "../../domain/repositories/appointment.repository";

@Injectable()
export class AppointmentAvailabilityService {
	constructor(
		private readonly appointmentRepository: AppointmentRepository,
		private readonly companyAvailabilityRepo: CompanyAvailabilityRepository,
		private readonly companyAvailabilityExceptionRepo: CompanyAvailabilityExcpetionRepository,
	) {}

	async getAvailability(
		companyId: string,
		serviceId: string,
		startDate: Date,
		serviceDuration: number,
	) {
		const endDate = addMinutes(startDate, serviceDuration);
		const dayOfWeek = daysOfWeek[startDate.getDay()];

		const [companyAvailability, exceptions, appointments] = await Promise.all([
			this.companyAvailabilityRepo.findByCompanyIdAndDayOfWeek(
				companyId,
				dayOfWeek,
			),
			this.companyAvailabilityExceptionRepo.findExceptionsByCompanyAndPeriod(
				companyId,
				{ startDate, endDate },
			),
			this.appointmentRepository.getAppointmentsByPeriod({
				serviceId,
				startDate,
				endDate,
			}),
		]);

		if (!companyAvailability || exceptions?.length || appointments?.length) {
			return { isAvailable: false };
		}

		return {
			isAvailable: true,
			timeRange: companyAvailability.timeRange,
		};
	}
}
