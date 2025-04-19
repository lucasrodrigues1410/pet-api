import { Either, left, right } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { Appointment } from "../../domain/entities/appointment.entity";
import { AppointmentRepository } from "../../domain/repositories/appointment.repository";
import { Animal } from "@/modules/animal/domain/entities/animal.entity";
import { User } from "@/modules/user/domain/entities/user.entity";
import { Service } from "@/modules/service/domain/entities/service.entity";
import { Company } from "@/modules/company/domain/entities/company.entity";

type GetAppointmentByIdUseCaseInput = {
	id: string;
	userId: string;
};

type GetAppointmentByIdUseCaseOutput = Either<
	ResourceNotFoundError,
	Appointment & {
		animal: Animal;
		client: User;
		service: Service;
		company: Company;
	}
>;

export class GetAppointmentByIdUseCase {
	constructor(private readonly appointmentRepository: AppointmentRepository) {}

	async execute({
		id,
		userId,
	}: GetAppointmentByIdUseCaseInput): Promise<GetAppointmentByIdUseCaseOutput> {
		const appointment = await this.appointmentRepository.findById(id);
		if (!appointment) {
			return left(
				new ResourceNotFoundError(`Agendamento com id ${id} não encontrado`),
			);
		}

		if (appointment.clientId.toString() !== userId) {
			return left(
				new ResourceNotFoundError(
					"Você não tem permissão para acessar este agendamento",
				),
			);
		}

		return right(appointment);
	}
}
