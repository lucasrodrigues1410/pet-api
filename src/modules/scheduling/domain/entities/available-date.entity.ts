import { Entity } from "@/core/entities/entity";
import { TimeSlot } from "./time-slot.entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface AvailableDateProps {
    date: Date;
    timeSlots: TimeSlot[];
}

export class AvailableDate extends Entity<AvailableDateProps> {
	get date(): Date {
		return this.props.date;
	}

	get timeSlots() {
		return this.props.timeSlots;
	}

	addTimeSlot(timeSlot: TimeSlot) {
		this.props.timeSlots.push(timeSlot);
	}

	static create(props: AvailableDateProps, id?: UniqueEntityID): AvailableDate {
		return new AvailableDate(
			{
				...props,
				timeSlots: props.timeSlots || [],
			},
			id,
		);
	}
}