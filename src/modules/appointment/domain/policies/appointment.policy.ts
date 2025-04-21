import { UserType } from "@/modules/user/domain/entities/user.entity";
import { Either } from "@/shared/either";
import { NotAllowedError } from "@/shared/errors/errors/not-allowed.error";
import { Appointment } from "../entities/appointment.entity";

export abstract class AppointmentPolicy {
	abstract ensureCanCancel(params: {
		user: { id: string; type: UserType };
		appointment: Appointment;
	}): Promise<Either<NotAllowedError, void>>;
}
