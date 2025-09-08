import { Injectable } from "@nestjs/common";
import {
	addMinutes,
	isAfter,
	isBefore,
	isEqual,
	set,
	startOfMinute,
} from "date-fns";
import { daysOfWeek } from "@/modules/company-availability/domain/entities/company-availability.entity";
import { CompanyAvailabilityRepository } from "@/modules/company-availability/domain/repositories/company-availability.repository";
import { StaffRepository } from "@/modules/staff/domain/repositories/staff.repository";

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
		const matchTime = openingTime.split(":");
		const matchClosingTime = closingTime.split(":");
		if (matchTime.length !== 2 || matchClosingTime.length !== 2) {
			throw new Error("Invalid opening time format");
		}

		const [openingHour, openingMinute] = matchTime.map(Number);
		const [closingHour, closingMinute] = matchClosingTime.map(Number);

		const selectTimeWithDuration = addMinutes(selectedTime, serviceDuration);
		const openingDate = startOfMinute(
			set(selectedTime, {
				hours: openingHour,
				minutes: openingMinute,
			}),
		);
		const closingDate = startOfMinute(
			set(selectedTime, {
				hours: closingHour,
				minutes: closingMinute,
			}),
		);
		
		return (
			(isAfter(selectedTime, openingDate) || isEqual(selectedTime, openingDate)) &&
			(isBefore(selectTimeWithDuration, closingDate) || isEqual(selectTimeWithDuration, closingDate))
		);
	}
}
