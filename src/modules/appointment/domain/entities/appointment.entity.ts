import { Entity } from "@/core/domain/entities/entity";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";

export interface AppointmentProps {
	animalId: UniqueEntityID;
	clientId: UniqueEntityID;
	serviceId: UniqueEntityID;
	startDate: Date;
	endDate: Date;
	status: AppointmentStatus;
	price: number;
}

export type AppointmentStatus =
	| "SCHEDULED"
	| "CONFIRMED"
	| "IN_PROGRESS"
	| "COMPLETED"
	| "CANCELED";

export class Appointment extends Entity<AppointmentProps> {
	get animalId() {
		return this.props.animalId;
	}

	get clientId() {
		return this.props.clientId;
	}

	get serviceId() {
		return this.props.serviceId;
	}

	get status() {
		return this.props.status ?? "SCHEDULED";
	}

	get price() {
		return this.props.price;
	}

	get startDate() {
		return this.props.startDate;
	}

	get endDate() {
		return this.props.endDate;
	}

	public static create(
		props: Omit<AppointmentProps, "status"> & {
			status?: AppointmentStatus;
		},
		id?: UniqueEntityID,
	): Appointment {
		return new Appointment(
			{
				...props,
				status: props.status ?? "SCHEDULED",
			},
			id,
		);
	}
}
