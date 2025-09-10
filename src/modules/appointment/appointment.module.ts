import { Module } from "@nestjs/common";
import { GetAppointmentByCompanyIdUseCase } from "./application/use-cases/get-appointment-by-company-id.use-case";
import { GetAppointmentByIdUseCase } from "./application/use-cases/get-appointment-by-id.use-case";
import { GetAppointmentByUserIdUseCase } from "./application/use-cases/get-appointment-by-user-id.use-case";
import { UpdateAppointmentStatusUseCase } from "./application/use-cases/update-appointment-status.use-case";
import { AppointmentRepository } from "./domain/repositories/appointment.repository";
import { PrismaAppointmentRepository } from "./infra/database/repositories/prisma-appointment.repository";
import { AppointmentController } from "./infra/http/controllers/appointment.controller";

@Module({
	providers: [
		GetAppointmentByIdUseCase,
		GetAppointmentByUserIdUseCase,
		GetAppointmentByCompanyIdUseCase,
		UpdateAppointmentStatusUseCase,
		{ provide: AppointmentRepository, useClass: PrismaAppointmentRepository },
	],
	controllers: [AppointmentController],
	exports: [
		{ provide: AppointmentRepository, useClass: PrismaAppointmentRepository },
	],
})
export class AppointmentModule {}
