import { Injectable } from "@nestjs/common";
import { DomainError } from "@/core/domain/errors/domain-error";
import { AppointmentChangeStatusEvent } from "@/modules/notification/domain/events/appointment-change-status.event";
import { NotificationPublisher } from "@/modules/notification/domain/interfaces/notification-publisher.interface";
import { UserType } from "@/modules/user/domain/entities/user.entity";
import { Either, left, right } from "@/shared/either";
import { NotAllowedError } from "@/shared/errors/errors/not-allowed.error";
import { ResourceNotFoundError } from "@/shared/errors/errors/resource-not-found.error";
import {
	Appointment,
	AppointmentStatus,
} from "../../domain/entities/appointment.entity";
import { AppointmentRepository } from "../../domain/repositories/appointment.repository";

type UpdateAppointmentStatusUseCaseInput = {
	appointmentId: string;
	newStatus: AppointmentStatus;
	userId: string;
	userType: UserType;
	companyId?: string;
};

type UpdateAppointmentStatusUseCaseOutput = Either<
	ResourceNotFoundError | NotAllowedError,
	Appointment
>;

@Injectable()
export class UpdateAppointmentStatusUseCase {
	constructor(
		private readonly appointmentRepository: AppointmentRepository,
		private readonly notifyPublisher: NotificationPublisher,
	) {}

	async execute({
		appointmentId,
		newStatus,
		userId,
		userType,
		companyId,
	}: UpdateAppointmentStatusUseCaseInput): Promise<UpdateAppointmentStatusUseCaseOutput> {
		const appointment =
			await this.appointmentRepository.findById(appointmentId);
		if (!appointment) {
			return left(
				new ResourceNotFoundError(
					`Agendamento com id ${appointmentId} não encontrado`,
				),
			);
		}

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
			appointment.updateStatus(newStatus, userType === "company");

			await this.appointmentRepository.updateStatus(appointmentId, newStatus);
			await this.notifyPublisher.dispatch(
				new AppointmentChangeStatusEvent(appointment.client.id.toString(), {
					userName: appointment.client.name,
					userEmail: appointment.client.email,
					appointmentId: appointmentId,
					appointmentStatus: appointment.status,
					petName: appointment.animal.name,
					providerName: appointment.service.name,
					serviceName: appointment.service.name,
					updatedOn: new Date(),
				}),
			);
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
		if (userType === "customer") {
			return appointment.clientId.toString() === userId;
		}

		if (userType === "company") {
			return appointment.companyId.toString() === companyId;
		}

		return false;
	}
}
