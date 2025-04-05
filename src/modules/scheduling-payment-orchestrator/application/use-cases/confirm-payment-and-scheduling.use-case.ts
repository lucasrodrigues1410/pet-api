import { Injectable } from "@nestjs/common";
import { AppointmentRepository } from "@/modules/appointment/domain/repositories/appointment.repository";
import { AppointmentIntentRepository } from "@/modules/appointment/domain/repositories/appointment-intent.repository";
import { Appointment } from "@/modules/appointment/domain/entities/appointment.entity";
import { PaymentRepository } from "@/modules/payment/domain/repositories/payment.repository";
import { Payment } from "@/modules/payment/domain/entities/payment.entity";

type ConfirmPaymentAndSchedulingUseCaseRequest = {
	scheduleData: {
		appointmentIntentId: string;
	};
};

@Injectable()
export class ConfirmPaymentAndSchedulingUseCase {
	constructor(
		private readonly paymentRepository: PaymentRepository,
		private readonly appointmentRepository: AppointmentRepository,
		private readonly appointmentIntentRepository: AppointmentIntentRepository,
	) {}

	async execute({
		scheduleData,
	}: ConfirmPaymentAndSchedulingUseCaseRequest): Promise<void> {
		const appointmentIntent = await this.appointmentIntentRepository.findById(
			scheduleData.appointmentIntentId,
		);

		if (!appointmentIntent) {
			throw new Error("Failed to find appointment intent");
		}

		const payment = Payment.create({
			amount: appointmentIntent.price,
		});
		const appointment = Appointment.create({
			animalId: appointmentIntent.animalId,
			clientId: appointmentIntent.clientId,
			endDate: appointmentIntent.endDate,
			startDate: appointmentIntent.startDate,
			serviceId: appointmentIntent.serviceId,
			price: appointmentIntent.price,
			paymentId: payment.id,
		});

		await this.paymentRepository.create(payment);
		await this.appointmentRepository.create(appointment);
	}
}
