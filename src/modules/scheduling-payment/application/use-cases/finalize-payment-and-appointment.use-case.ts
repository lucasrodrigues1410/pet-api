import { Appointment } from "@/modules/appointment/domain/entities/appointment.entity";
import { AppointmentIntentRepository } from "@/modules/appointment/domain/repositories/appointment-intent.repository";
import { AppointmentRepository } from "@/modules/appointment/domain/repositories/appointment.repository";
import { PaymentService } from "@/modules/payment/application/services/payment-service";
import { Payment } from "@/modules/payment/domain/entities/payment.entity";
import { Injectable } from "@nestjs/common";

type FinalizePaymentAndAppointmentUseCaseRequest = {
	scheduleData: {
		appointmentIntentId: string;
	};
};

@Injectable()
export class FinalizePaymentAndAppointmentUseCase {
	constructor(
		private readonly paymentService: PaymentService,
		private readonly appointmentRepository: AppointmentRepository,
		private readonly appointmentIntentRepository: AppointmentIntentRepository,
	) {}

	async execute({
		scheduleData,
	}: FinalizePaymentAndAppointmentUseCaseRequest): Promise<void> {
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

		//TODO: Implementar atomização de transações
		await this.paymentService.createPaymentRecord(payment);
		await this.appointmentRepository.create(appointment);
	}
}
