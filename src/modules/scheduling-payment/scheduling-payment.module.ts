import { AppointmentModule } from "@/modules/appointment/appointment.module";
import { PaymentModule } from "@/modules/payment/payment.module";
import { Module } from "@nestjs/common";
import { PriceVariationModule } from "../price-variation/price-variation.module";
import { ServiceModule } from "../service/service.module";
import { FinalizePaymentAndAppointmentUseCase } from "./application/use-cases/finalize-payment-and-appointment.use-case";
import { AppointmentBookingUseCase } from "./application/use-cases/appointment-booking.use-case";
import { SchedulingPaymentController } from "./infra/http/controllers/scheduling-payment.controller";
import { SchedulingPaymentProcessor } from "./infra/queue/processors/scheduling-payment.processor";

@Module({
	imports: [
		PaymentModule,
		ServiceModule,
		PriceVariationModule,
		AppointmentModule,
	],
	controllers: [SchedulingPaymentController],
	providers: [
		SchedulingPaymentProcessor,
		AppointmentBookingUseCase,
		FinalizePaymentAndAppointmentUseCase,
	],
})
export class SchedulingPaymentModule {}
