import { Injectable } from "@nestjs/common";
import { DomainError } from "@/core/domain/errors/domain-error";
import { AppointmentChangeStatusEvent } from "@/modules/notification/domain/events/appointment-change-status.event";
import { NotificationPublisher } from "@/modules/notification/domain/interfaces/notification-publisher.interface";
import { StaffRepository } from "@/modules/staff/domain/repositories/staff.repository";
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
	status: AppointmentStatus;
	userId?: string;
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
		private readonly staffRepo: StaffRepository,
	) {}

	async execute({
		appointmentId,
		status: newStatus,
		userId,
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

		const { allowed, isStaff } = await this.checkPermissions(
			appointment,
			userId,
		);
		if (!allowed) {
			return left(
				new NotAllowedError(
					"Você não tem permissão para alterar este agendamento",
				),
			);
		}

		try {
			appointment.updateStatus(newStatus, isStaff);
			await this.appointmentRepository.updateStatus(appointmentId, newStatus);
			await this.notifyPublisher.dispatch(
				new AppointmentChangeStatusEvent(
					appointment.client.id.toString(),
					appointment.client.email,
					{
						userName: appointment.client.name,
						appointmentStatus: appointment.status,
						petName: appointment.animal.name,
						serviceName: appointment.service.name,
						updatedOn: new Date(),
					},
				),
			);
			return right(appointment);
		} catch (error) {
			if (error instanceof DomainError) {
				return left(new NotAllowedError(error.message));
			}
			throw error;
		}
	}

	private async checkPermissions(appointment: Appointment, userId?: string) {
		if (!userId) return { isStaff: false, allowed: true };
		if (appointment.clientId.toString() === userId)
			return { isStaff: false, allowed: true };

		const staff = await this.staffRepo.findByUserId(userId);
		if (!staff) return { isStaff: false, allowed: false };

		return {
			isStaff: true,
			allowed: staff.companyId.toString() === appointment.companyId.toString(),
		};
	}
}
