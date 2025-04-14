import { daysOfWeek } from "@/modules/company-availability/domain/entities/company-availability.entity";
import { CompanyAvailabilityRepository } from "@/modules/company-availability/domain/repositories/company-availability.repository";
import { StaffRepository } from "@/modules/staff/domain/repositories/staff.repository";
import { Injectable } from "@nestjs/common";
import {
	addMinutes,
	differenceInMinutes,
	isAfter,
	isBefore,
	setHours,
	setMinutes,
	startOfDay,
} from "date-fns";

@Injectable()
export class AppointmentAvailabilityService {
	constructor(
		private readonly companyAvailabilityRepo: CompanyAvailabilityRepository,
		private readonly staffRepo: StaffRepository,
	) {}

	async getAvailability(
		companyId: string,
		startDate: Date,
		serviceDuration: number,
	) {
		const endDate = addMinutes(startDate, serviceDuration);
		const dayOfWeek = daysOfWeek[startDate.getDay()];

		const [companyAvailability, staffMembers] = await Promise.all([
			this.companyAvailabilityRepo.findByCompanyIdAndDayOfWeek(
				companyId,
				dayOfWeek,
			),
			this.staffRepo.findAvailableForSlot(companyId, {
				startDate: startDate,
				endDate: endDate,
			}),
		]);

		if (!companyAvailability || !staffMembers.length) {
			return {
				isValid: false,
				staffChoiced: null,
			};
		}

		const isValid = this.isValid(
			startDate,
			serviceDuration,
			companyAvailability.timeRange.startTime,
			companyAvailability.timeRange.endTime,
		);

		const randomIndex = Math.floor(Math.random() * staffMembers.length);
		return {
			isValid,
			staffChoiced: staffMembers[randomIndex],
		};
	}

	isValid(
		selectedTime: Date,
		serviceDuration: number,
		openingTime: string,
		closingTime: string,
	): boolean {
		const [openingHour, openingMinute] = openingTime.split(":").map(Number);
		const [closingHour, closingMinute] = closingTime.split(":").map(Number);

		const dayStart = startOfDay(selectedTime);
		const openingDate = setMinutes(
			setHours(dayStart, openingHour),
			openingMinute,
		);
		const closingDate = setMinutes(
			setHours(dayStart, closingHour),
			closingMinute,
		);

		if (
			isBefore(selectedTime, openingDate) ||
			isAfter(selectedTime, closingDate)
		) {
			return false;
		}

		const appointmentEnd = addMinutes(selectedTime, serviceDuration);
		if (isAfter(appointmentEnd, closingDate)) {
			return false;
		}

		const minutesSinceOpening = differenceInMinutes(selectedTime, openingDate);
		return minutesSinceOpening % serviceDuration === 0;
	}
}
