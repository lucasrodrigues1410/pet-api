import { Appointment } from "@/modules/appointment/domain/entities/appointment.entity";
import { AppointmentPolicy } from "@/modules/appointment/domain/policies/appointment.policy";
import { UserType } from "@/modules/user/domain/entities/user.entity";

export class AppointmentPolicyMock extends AppointmentPolicy {
	constructor(private allowed = true) {
		super();
	}

	async ensureCanCancel(params: {
		user: { id: string; type: UserType };
		appointment: Appointment;
	}) {
		return this.allowed
	}
}
