import { UserType } from "@/modules/user/domain/entities/user.entity";
import { Appointment } from "../entities/appointment.entity";

export abstract class AppointmentPolicy {
	abstract ensureCanCancel(params: {
		user: { id: string; type: UserType };
		appointment: Appointment;
	}): Promise<boolean>;
}
