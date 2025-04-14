import { Entity } from "@/core/domain/entities/entity";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { Animal } from "@/modules/animal/domain/entities/animal.entity";
import { Company } from "@/modules/company/domain/entities/company.entity";
import { Service } from "@/modules/service/domain/entities/service.entity";
import { User } from "@/modules/user/domain/entities/user.entity";

export enum CoatType {
	SHORT = "SHORT",
	MEDIUM = "MEDIUM",
	LONG = "LONG",
}

export interface AppointmentProps {
	animalId: UniqueEntityID;
	staffId: UniqueEntityID;
	clientId: UniqueEntityID;
	serviceId: UniqueEntityID;
	companyId: UniqueEntityID;
	startDate: Date;
	endDate: Date;
	status: AppointmentStatus;
	price: number;
	coatType: CoatType;
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

	get staffId() {
		return this.props.staffId;
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

	get coatType() {
		return this.props.coatType;
	}

	get clientId() {
		return this.props.clientId;
	}

	get companyId() {
		return this.props.companyId;
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

export type AppointmentWithDetails = Appointment & {
	animal: Animal;
	client: User;
	service: Service;
	company: Company;
};
