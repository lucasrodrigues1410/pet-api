import { Entity } from "@/core/domain/entities/entity";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { Appointment } from "@/modules/appointment/domain/entities/appointment.entity";

export const staffRole = ["admin", "manager", "employee"] as const;
export type StaffRole = (typeof staffRole)[number];

export interface StaffProps {
	userId: UniqueEntityID;
	companyId: UniqueEntityID;
	role: StaffRole;
	appointments?: Appointment[];
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

	set appointments(appointments: Appointment[] | undefined) {
		this.props.appointments = appointments;
	}

	static create(props: StaffProps, id?: UniqueEntityID): Staff {
		const staff = new Staff(props, id);
		return staff;
	}
}
