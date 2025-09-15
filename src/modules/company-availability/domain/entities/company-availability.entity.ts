import { Entity } from "@/core/domain/entities/entity";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { TimeRange } from "./value-objects/time-range";

export const daysOfWeek = [
	"sunday",
	"monday",
	"tuesday",
	"wednesday",
	"thursday",
	"friday",
	"saturday",
] as const;
export type DaysOfWeek = (typeof daysOfWeek)[number];

export interface CompanyAvailabilityProps {
	companyId: UniqueEntityID;
	day: DaysOfWeek;
	timeRange: TimeRange;
	launchTime: TimeRange;
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

	get launchTime() {
		return this.props.launchTime;
	}

	static create(
		props: Omit<CompanyAvailabilityProps, "timeRange" | "launchTime"> & {
			startTime: string;
			endTime: string;
			lunchStartTime: string;
			lunchEndTime: string;
		},
		id?: UniqueEntityID,
	): CompanyAvailability {
		if (!daysOfWeek.includes(props.day)) {
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
				launchTime: new TimeRange({
					startTime: props.lunchStartTime,
					endTime: props.lunchEndTime,
				}),
			},
			id,
		);
		return companyAvailability;
	}
}
