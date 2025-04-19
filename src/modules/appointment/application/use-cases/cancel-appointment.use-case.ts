import { Either, left, right } from "@/shared/either";
import { AppointmentRepository } from "../../domain/repositories/appointment.repository";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { UserType } from "@/modules/user/domain/entities/user.entity";
import { AppointmentPolicy } from "../../domain/policies/appointment.policy";

type InputProps = {
	appointmentId: string;
	user: {
		id: string;
		type: UserType;
	};
};

type OutputProps = Either<ResourceNotFoundError, void>;

export class CancelAppointmentUseCase {
	constructor(
		private readonly appointmentRepository: AppointmentRepository,
		private readonly appointmentPolicy: AppointmentPolicy,
	) {}

	async execute(params: InputProps): Promise<OutputProps> {
		const appointment = await this.appointmentRepository.findById(
			params.appointmentId,
		);
		if (!appointment) {
			return left(new ResourceNotFoundError("Agendamento não encontrado"));
		}

		const hasPermission = await this.appointmentPolicy.ensureCanCancel({
			appointment,
			user: params.user,
		});

		if (hasPermission.isLeft()) {
			return left(hasPermission.value);
		}

		appointment.cancel();
        
		await this.appointmentRepository.update(appointment);
		return right(undefined);
	}
}
