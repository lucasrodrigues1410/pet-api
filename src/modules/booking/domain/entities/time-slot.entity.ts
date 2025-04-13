import { Entity } from "@/core/domain/entities/entity";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";

export interface TimeSlotProps {
	label?: string;
}

export class TimeSlot extends Entity<TimeSlotProps> {
	get label(): string | undefined {
		return this.props.label;
	}

	static create(props: TimeSlotProps, id?: UniqueEntityID): TimeSlot {
		return new TimeSlot(props, id);
	}
}
