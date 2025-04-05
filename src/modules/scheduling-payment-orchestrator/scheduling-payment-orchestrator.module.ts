import { AppointmentModule } from "@/modules/appointment/appointment.module";
import { PaymentModule } from "@/modules/payment/payment.module";
import { Module } from "@nestjs/common";
import { PriceVariationModule } from "../price-variation/price-variation.module";
import { ServiceModule } from "../service/service.module";
import { PaymentEventListener } from "./application/listeners/payment.event-listener";
import { ConfirmPaymentAndSchedulingUseCase } from "./application/use-cases/confirm-payment-and-scheduling.use-case";
import { InitiateAppointmentCreationUseCase } from "./application/use-cases/initiate-appointment-creation.use-case";
import { SchedulingPaymentOrchestratorController } from "./infra/http/controllers/scheduling-payment-orchestrator.controller";

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
