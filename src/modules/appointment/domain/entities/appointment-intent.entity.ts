import { Entity } from "@/core/domain/entities/entity";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { addMinutes } from "date-fns";

export interface AppointmentIntentProps {
	animalId: UniqueEntityID;
	clientId: UniqueEntityID;
	serviceId: UniqueEntityID;
	startDate: Date;
	endDate: Date;
	price: number;
	validUntil: Date;

	createdAt: Date;
	updatedAt?: Date;
}

export class AppointmentIntent extends Entity<AppointmentIntentProps> {
	public get animalId() {
		return this.props.animalId;
	}

	public get clientId() {
		return this.props.clientId;
	}

	public get serviceId() {
		return this.props.serviceId;
	}

	public get startDate() {
		return this.props.startDate;
	}

	public get endDate() {
		return this.props.endDate;
	}

	public get price() {
		return this.props.price;
	}

	public get createdAt() {
		return this.props.createdAt;
	}

	public get updatedAt() {
		return this.props.updatedAt;
	}

	public get validUntil() {
		return this.props.validUntil;
	}

	public static create(
		props: Omit<AppointmentIntentProps, "createdAt" | "validUntil"> & {
			createdAt?: Date;
			validUntil?: Date;
		},
		id?: UniqueEntityID,
	): AppointmentIntent {
		return new AppointmentIntent(
			{
				createdAt: new Date(),
				validUntil: addMinutes(new Date(), Number(5)),
				...props,
			},
			id,
		);
	}
}
