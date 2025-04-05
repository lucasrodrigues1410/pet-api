import { Module } from "@nestjs/common";
import { CompanyAvailabilityModule } from "../company-availability/company-availability.module";
import { ServiceModule } from "../service/service.module";
import { AppointmentAvailabilityService } from "./application/services/appointment-availability.service";
import { ListAvailableDatesUseCase } from "./application/use-cases/list-available-dates.use-case";
import { AppointmentRepository } from "./domain/repositories/appointment.repository";
import { PrismaAppointmentRepository } from "./infra/database/repositories/prisma-appointment.repository";
import { AppointmentController } from "./infra/http/controllers/appointment.controller";
import { AppointmentIntentRepository } from "./domain/repositories/appointment-intent.repository";
import { PrismaAppointmentIntentRepository } from "./infra/database/repositories/prisma-appointment-intent.repository";

@Module({
	imports: [
		CompanyAvailabilityModule,
		ServiceModule,
	],
	controllers: [AppointmentController],
	providers: [
		ListAvailableDatesUseCase,
		AppointmentAvailabilityService,
		{
			provide: AppointmentRepository,
			useClass: PrismaAppointmentRepository,
		},
		{
			provide: AppointmentIntentRepository,
			useClass: PrismaAppointmentIntentRepository,
		},
	],
	exports: [
		AppointmentAvailabilityService,
		{
			provide: AppointmentRepository,
			useClass: PrismaAppointmentRepository,
		},
		{
			provide: AppointmentIntentRepository,
			useClass: PrismaAppointmentIntentRepository,
		},
	],
})
export class AppointmentModule {}
