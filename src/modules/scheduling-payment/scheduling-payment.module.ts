import { AppointmentModule } from "@/modules/appointment/appointment.module";
import { PaymentModule } from "@/modules/payment/payment.module";
import { Module } from "@nestjs/common";
import { PriceVariationModule } from "../price-variation/price-variation.module";
import { ServiceModule } from "../service/service.module";
import { ConfirmPaymentAndSchedulingUseCase } from "./application/use-cases/confirm-payment-and-scheduling.use-case";
import { InitiateAppointmentCreationUseCase } from "./application/use-cases/initiate-appointment-creation.use-case";
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
		InitiateAppointmentCreationUseCase,
		ConfirmPaymentAndSchedulingUseCase,
	],
})
export class SchedulingPaymentModule {}
