import { Injectable } from "@nestjs/common";
import { DomainError } from "@/core/domain/errors/domain-error";
import { UserType } from "@/modules/user/domain/entities/user.entity";
import { Either, left, right } from "@/shared/either";
import { NotAllowedError } from "@/shared/errors/errors/not-allowed.error";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import { Appointment } from "../../domain/entities/appointment.entity";
import { AppointmentStatus } from "../../domain/enums/appointment.enum";
import { AppointmentRepository } from "../../domain/repositories/appointment.repository";

type UpdateAppointmentStatusUseCaseInput = {
	appointmentId: string;
	newStatus: AppointmentStatus;
	userId: string;
	userType: UserType;
	companyId?: string; // Para usuários empresa
};

type UpdateAppointmentStatusUseCaseOutput = Either<
	ResourceNotFoundError | NotAllowedError,
	Appointment
>;

@Injectable()
export class UpdateAppointmentStatusUseCase {
	constructor(private readonly appointmentRepository: AppointmentRepository) {}

	async execute({
		appointmentId,
		newStatus,
		userId,
		userType,
		companyId,
	}: UpdateAppointmentStatusUseCaseInput): Promise<UpdateAppointmentStatusUseCaseOutput> {
		// Buscar o agendamento
		const appointment =
			await this.appointmentRepository.findById(appointmentId);
		if (!appointment) {
			return left(
				new ResourceNotFoundError(
					`Agendamento com id ${appointmentId} não encontrado`,
				),
			);
		}

		// Verificar permissões de acesso
		const hasPermission = this.checkPermissions(
			appointment,
			userId,
			userType,
			companyId,
		);
		if (!hasPermission) {
			return left(
				new NotAllowedError(
					"Você não tem permissão para alterar este agendamento",
				),
			);
		}

		try {
			// Atualizar status usando as regras de domínio
			const isCompany = userType === UserType.COMPANY;
			appointment.updateStatus(newStatus, isCompany);

			// Persistir alteração
			await this.appointmentRepository.updateStatus(appointmentId, newStatus);

			return right(appointment);
		} catch (error) {
			if (error instanceof DomainError) {
				return left(new NotAllowedError(error.message));
			}
			throw error;
		}
	}

	private checkPermissions(
		appointment: Appointment,
		userId: string,
		userType: UserType,
		companyId?: string,
	): boolean {
		if (userType === UserType.CUSTOMER) {
			return appointment.clientId.toString() === userId;
		}

		if (userType === UserType.COMPANY) {
			return appointment.companyId.toString() === companyId;
		}

		return false;
	}
}
