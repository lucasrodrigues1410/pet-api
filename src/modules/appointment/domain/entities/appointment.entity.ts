import { Entity } from "@/core/domain/entities/entity";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { DomainError } from "@/core/domain/errors/domain-error";
import { AppointmentStatus, CoatType } from "../enums/appointment.enum";

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

	set status(status: AppointmentStatus) {
		this.props.status = status;
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

	public updateStatus(newStatus: AppointmentStatus, isCompany: boolean): void {
		this.validateStatusTransition(this.props.status, newStatus);
		this.validateStatusPermissions(newStatus, isCompany);
		this.props.status = newStatus;
	}

	private validateStatusTransition(
		currentStatus: AppointmentStatus,
		newStatus: AppointmentStatus,
	): void {
		const validTransitions: Record<AppointmentStatus, AppointmentStatus[]> = {
			[AppointmentStatus.SCHEDULED]: [
				AppointmentStatus.CONFIRMED,
				AppointmentStatus.CANCELED,
				AppointmentStatus.NO_SHOW,
			],
			[AppointmentStatus.CONFIRMED]: [
				AppointmentStatus.IN_PROGRESS,
				AppointmentStatus.CANCELED,
				AppointmentStatus.NO_SHOW,
			],
			[AppointmentStatus.IN_PROGRESS]: [
				AppointmentStatus.COMPLETED,
				AppointmentStatus.CANCELED,
			],
			[AppointmentStatus.COMPLETED]: [],
			[AppointmentStatus.NO_SHOW]: [],
			[AppointmentStatus.CANCELED]: [],
		};

		if (!validTransitions[currentStatus]?.includes(newStatus)) {
			throw new DomainError(
				`Invalid status transition from '${currentStatus}' to '${newStatus}'.`,
			);
		}
	}

	private validateStatusPermissions(
		newStatus: AppointmentStatus,
		isCompany: boolean,
	): void {
		if (newStatus === AppointmentStatus.NO_SHOW && !isCompany) {
			throw new DomainError(
				"Only company staff can set appointment status to NO_SHOW.",
			);
		}

		if (
			(newStatus === AppointmentStatus.IN_PROGRESS ||
				newStatus === AppointmentStatus.COMPLETED) &&
			!isCompany
		) {
			throw new DomainError(
				"Only company staff can set appointment status to IN_PROGRESS or COMPLETED.",
			);
		}
	}

	public static create(
		props: Omit<AppointmentProps, "status"> & {
			status?: AppointmentStatus;
		},
		id?: UniqueEntityID,
	): Appointment {
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

	public toObject() {
		return {
			id: this.id.toString(),
			animalId: this.animalId.toString(),
			staffId: this.staffId.toString(),
			serviceId: this.serviceId.toString(),
			companyId: this.companyId.toString(),
			startDate: this.startDate.toISOString(),
			endDate: this.endDate.toISOString(),
			status: this.status,
			price: this.price,
			coatType: this.coatType,
			clientId: this.clientId.toString(),
		};
	}
}
