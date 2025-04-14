import { Either, left, right } from "@/shared/either";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { Appointment } from "../../domain/entities/appointment.entity";
import { AppointmentRepository } from "../../domain/repositories/appointment.repository";

type GetAppointmentByIdUseCaseInput = {
	id: string;
	userId: string;
};

type GetAppointmentByIdUseCaseOutput = Either<
	ResourceNotFoundError,
	Appointment
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
				new ResourceNotFoundError('Você não tem permissão para acessar este agendamento'),
			);
		}

		return right(appointment);
	}
}
