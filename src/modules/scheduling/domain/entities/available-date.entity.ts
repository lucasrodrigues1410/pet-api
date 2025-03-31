import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { TimeSlot } from "./time-slot.entity";

export interface AvailableDateProps {
	date: Date;
	slots: TimeSlot[];
}

export class AvailableDate extends Entity<AvailableDateProps> {
	get date(): Date {
		return this.props.date;
	}

	get slots() {
		return this.props.slots;
	}

	addSlot(timeSlot: TimeSlot) {
		this.props.slots.push(timeSlot);
	}

	static create(props: AvailableDateProps, id?: UniqueEntityID): AvailableDate {
		return new AvailableDate(
			{
				...props,
				slots: props.slots || [],
			},
			id,
		);
	}
}
