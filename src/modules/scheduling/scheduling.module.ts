import { Module } from "@nestjs/common";
import { CompanyAvailabilityModule } from "../company-availability/company-availability.module";
import { PaymentModule } from "../payment/payment.module";
import { PriceVariationModule } from "../price-variation/price-variation.module";
import { ServiceModule } from "../service/service.module";
import { ListAvailableDatesUseCase } from "./application/use-cases/list-available-dates.use-case";
import { AppointmentRepository } from "./domain/repositories/appointment.repository";
import { PrismaAppointmentRepository } from "./infra/database/repositories/prisma-appointment.repository";
import { AppointmentController } from "./infra/http/controllers/appointment.controller";
import { CreateAppointmentUseCase } from "./application/use-cases/create-appointment.use-case";
import { AppointmentAvailabilityService } from "./application/services/appointment-availability.service";

@Module({
	imports: [
		CompanyAvailabilityModule,
		ServiceModule,
		PaymentModule,
		PriceVariationModule,
	],
	controllers: [AppointmentController],
	providers: [
		ListAvailableDatesUseCase,
		CreateAppointmentUseCase,
		AppointmentAvailabilityService,
		{
			provide: AppointmentRepository,
			useClass: PrismaAppointmentRepository,
		},
	],
})
export class SchedulingModule {}
