import { Entity } from "@/core/domain/entities/entity";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { Appointment } from "@/modules/appointment/domain/entities/appointment.entity";

export const staffRole = ["admin", "member"] as const;
export type StaffRole = (typeof staffRole)[number];

export interface StaffProps {
	userId: UniqueEntityID;
	companyId: UniqueEntityID;
	role: StaffRole;
	appointments?: Appointment[];
	createdAt: Date;
	updatedAt?: Date;
	deletedAt?: Date;
}

export class Staff extends Entity<StaffProps> {
	get userId() {
		return this.props.userId;
	}

	get companyId() {
		return this.props.companyId;
	}

	get role() {
		return this.props.role;
	}

	get appointments() {
		return this.props.appointments;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	get deletedAt() {
		return this.props.deletedAt;
	}

	set appointments(appointments: Appointment[] | undefined) {
		this.props.appointments = appointments;
	}

	static create(
		props: Omit<StaffProps, "createdAt" | "updatedAt" | "deletedAt">,
		id?: UniqueEntityID,
	): Staff {
		const staff = new Staff({ ...props, createdAt: new Date() }, id);
		return staff;
	}

	toObject() {
		return {
			id: this.id.toString(),
			userId: this.userId.toString(),
			companyId: this.companyId.toString(),
			role: this.role,
			createdAt: this.createdAt.toISOString(),
			updatedAt: this.updatedAt?.toISOString(),
			deletedAt: this.deletedAt?.toISOString(),
		};
	}
}
