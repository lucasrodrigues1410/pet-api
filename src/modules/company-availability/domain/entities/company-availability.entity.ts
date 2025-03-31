import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export enum DaysOfWeek {
    SUNDAY = 'SUNDAY',
    MONDAY = 'MONDAY',
    TUESDAY = 'TUESDAY',
    WEDNESDAY = 'WEDNESDAY',
    THURSDAY = 'THURSDAY',
    FRIDAY = 'FRIDAY',
    SATURDAY = 'SATURDAY',
}

export interface CompanyAvailabilityProps {
	companyId: string;
	day: keyof typeof DaysOfWeek;
	startTime: string;
	endTime: string;
}

export class CompanyAvailability extends Entity<CompanyAvailabilityProps> {
	get companyId() {
		return this.props.companyId;
	}

	get day() {
		return this.props.day;
	}

	get startTime() {
		return this.props.startTime;
	}

	get endTime() {
		return this.props.endTime;
	}

	static create(
		props: CompanyAvailabilityProps,
		id?: UniqueEntityID,
	): CompanyAvailability {
        const daysOfWeek = Object.values(DaysOfWeek);
        if (!daysOfWeek.includes(props.day as DaysOfWeek)) {
            throw new Error(`Invalid day: ${props.day}. Must be one of ${daysOfWeek.join(', ')}`);
        }
        const startTime = new Date(`1970-01-01T${props.startTime}`);
        const endTime = new Date(`1970-01-01T${props.endTime}`);
        if (Number.isNaN(startTime.getTime()) || Number.isNaN(endTime.getTime())) {
            throw new Error("Invalid time format. Must be in HH:mm format.");
        }
        if (startTime >= endTime) {
            throw new Error("Start time must be before end time.");
        }

		const companyAvailability = new CompanyAvailability(props, id);
		return companyAvailability;
	}
}
