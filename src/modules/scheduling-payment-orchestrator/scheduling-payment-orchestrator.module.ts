import { Module } from "@nestjs/common";
import { PaymentModule } from "@/modules/payment/payment.module";
import { AppointmentModule } from "@/modules/appointment/appointment.module";
import { InitiateAppointmentCreationUseCase } from "./application/use-cases/initiate-appointment-creation.use-case";
import { ConfirmPaymentAndSchedulingUseCase } from "./application/use-cases/confirm-payment-and-scheduling.use-case";
import { SchedulingPaymentOrchestratorController } from "./infra/http/controllers/scheduling-payment-orchestrator.controller";
import { ServiceModule } from "../service/service.module";
import { PriceVariationModule } from "../price-variation/price-variation.module";
import { PaymentEventListener } from "./application/listeners/payment.event-listener";

@Module({
	imports: [
		PaymentModule,
		ServiceModule,
		PriceVariationModule,
		AppointmentModule,
	],
	controllers: [SchedulingPaymentOrchestratorController],
	providers: [
		PaymentEventListener,
		InitiateAppointmentCreationUseCase,
		ConfirmPaymentAndSchedulingUseCase,
	],
})
export class SchedulingPaymentOrchestratorModule {}
