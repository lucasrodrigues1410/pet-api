import { Module } from "@nestjs/common";
import { GetAppointmentByIdUseCase } from "./application/use-cases/get-appointment-by-id.use-case";
import { AppointmentRepository } from "./domain/repositories/appointment.repository";
import { PrismaAppointmentRepository } from "./infra/database/repositories/prisma-appointment.repository";
import { AppointmentController } from "./infra/http/controllers/appointment.controller";
import { GetAppointmentByUserIdUseCase } from "./application/use-cases/get-appointment-by-user-id.use-case";

@Module({
	providers: [
		GetAppointmentByIdUseCase,
		GetAppointmentByUserIdUseCase,
		{
			provide: AppointmentRepository,
			useClass: PrismaAppointmentRepository,
		},
	],
	controllers: [AppointmentController],
	exports: [
		{
			provide: AppointmentRepository,
			useClass: PrismaAppointmentRepository,
		},
	],
})
export class AppointmentModule {}
