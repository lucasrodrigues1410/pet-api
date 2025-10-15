import { Entity } from "@/core/domain/entities/entity";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { DomainError } from "@/core/domain/errors/domain-error";

export const coatType = ["short", "medium", "long", "curly"] as const;
export const appointmentStatus = [
	"scheduled",
	"confirmed",
	"in_progress",
	"completed",
	"no_show",
	"canceled",
] as const;

export type CoatType = (typeof coatType)[number];
export type AppointmentStatus = (typeof appointmentStatus)[number];

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
	coatType: "short" | "medium" | "long" | "curly";
}

export class Appointment extends Entity<AppointmentProps> {
	private static readonly CANCELLABLE_STATUSES: AppointmentStatus[] = [
		"scheduled",
		"confirmed",
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

		this.props.status = "canceled";
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
			scheduled: ["confirmed", "canceled", "no_show"],
			confirmed: ["in_progress", "canceled", "no_show"],
			in_progress: ["completed", "canceled"],
			completed: [],
			no_show: [],
			canceled: [],
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
		if (newStatus === "no_show" && !isCompany) {
			throw new DomainError(
				"Only company staff can set appointment status to NO_SHOW.",
			);
		}

		if (["in_progress", "completed"].includes(newStatus) && !isCompany) {
			throw new DomainError(
				"Only company staff can set appointment status to IN_PROGRESS or COMPLETED.",
			);
		}
	}

	public static create(
		props: Omit<AppointmentProps, "status"> & { status?: AppointmentStatus },
		id?: UniqueEntityID,
	): Appointment {
		if (props.startDate >= props.endDate) {
			throw new DomainError("startDate must be before endDate");
		}

		if (props.price <= 0) {
			throw new DomainError("Price must be positive");
		}

		return new Appointment(
			{ ...props, status: props.status ?? "scheduled" },
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
