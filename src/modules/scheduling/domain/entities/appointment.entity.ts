import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface AppointmentProps {
	animalId: string;
	clientId: string;
	companyId: string;
	serviceId: string;
	startDate: Date;
	endDate: Date;
	status?: AppointmentStatus;
	notes?: string;
	priceAtScheduling?: number;
}

export type AppointmentStatus =
	| "SCHEDULED"
	| "CONFIRMED"
	| "IN_PROGRESS"
	| "COMPLETED"
	| "CANCELED"
	| "NO_SHOW";

export class Appointment extends Entity<AppointmentProps> {
	get animalId() {
		return this.props.animalId;
	}
	get clientId() {
		return this.props.clientId;
	}
	get companyId() {
		return this.props.companyId;
	}
	get serviceId() {
		return this.props.serviceId;
	}
	get status() {
		return this.props.status ?? "SCHEDULED";
	}
	get notes() {
		return this.props.notes;
	}
	get priceAtScheduling() {
		return this.props.priceAtScheduling;
	}
	get startDate() {
		return this.props.startDate;
	}
	get endDate() {
		return this.props.endDate;
	}

	public static create(
		props: AppointmentProps,
		id?: UniqueEntityID,
	): Appointment {
		return new Appointment(props, id);
	}
}
