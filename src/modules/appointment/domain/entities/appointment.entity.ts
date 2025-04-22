import { Entity } from "@/core/domain/entities/entity";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { AppointmentStatus, CoatType } from "../enums/appointment.enum";
import { DomainError } from "@/core/domain/errors/domain-error";

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

export class Appointment extends Entity<AppointmentProps> {
	private static readonly CANCELLABLE_STATUSES: AppointmentStatus[] = [
		AppointmentStatus.SCHEDULED,
		AppointmentStatus.CONFIRMED,
	];

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
		return this.props.status;
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

	public cancel(): void {
		if (!Appointment.CANCELLABLE_STATUSES.includes(this.props.status)) {
			throw new DomainError(
				`Appointment cannot be canceled when status is '${this.props.status}'.`,
			);
		}

		this.props.status = AppointmentStatus.CANCELED;
	}

	public static create(
		props: Omit<AppointmentProps, "status"> & {
			status?: AppointmentStatus;
		},
		id?: UniqueEntityID,
	): Appointment {
		if (props.startDate < new Date()) {
			throw new DomainError("startDate must be in the future");
		}

		if (props.startDate >= props.endDate) {
			throw new DomainError("startDate must be before endDate");
		}

		if (props.price <= 0) {
			throw new DomainError("Price must be positive");
		}

		return new Appointment(
			{
				...props,
				status: props.status ?? AppointmentStatus.SCHEDULED,
			},
			id,
		);
	}
}
