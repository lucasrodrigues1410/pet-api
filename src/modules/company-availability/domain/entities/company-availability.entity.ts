import { Entity } from "@/core/domain/entities/entity";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { TimeRange } from "./value-objects/time-range";

export enum DaysOfWeek {
	SUNDAY = "SUNDAY",
	MONDAY = "MONDAY",
	TUESDAY = "TUESDAY",
	WEDNESDAY = "WEDNESDAY",
	THURSDAY = "THURSDAY",
	FRIDAY = "FRIDAY",
	SATURDAY = "SATURDAY",
}

export const daysOfWeek = Object.values(DaysOfWeek);

export interface CompanyAvailabilityProps {
	companyId: UniqueEntityID;
	day: keyof typeof DaysOfWeek;
	timeRange: TimeRange;
}

export class CompanyAvailability extends Entity<CompanyAvailabilityProps> {
	get companyId() {
		return this.props.companyId;
	}

	get day() {
		return this.props.day;
	}

	get timeRange() {
		return this.props.timeRange;
	}

	static create(
		props: Omit<CompanyAvailabilityProps, "timeRange"> & {
			startTime: string;
			endTime: string;
		},
		id?: UniqueEntityID,
	): CompanyAvailability {
		const daysOfWeek = Object.values(DaysOfWeek);
		if (!daysOfWeek.includes(props.day as DaysOfWeek)) {
			throw new Error(
				`Invalid day: ${props.day}. Must be one of ${daysOfWeek.join(", ")}`,
			);
		}

		const companyAvailability = new CompanyAvailability(
			{
				...props,
				timeRange: new TimeRange({
					startTime: props.startTime,
					endTime: props.endTime,
				}),
			},
			id,
		);
		return companyAvailability;
	}
}
