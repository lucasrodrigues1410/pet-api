import { Module } from "@nestjs/common";
import { NotificationModule } from "../notification/notification.module";
import { StaffModule } from "../staff/staff.module";
import { GetAppointmentByCompanyIdUseCase } from "./application/use-cases/get-appointment-by-company-id.use-case";
import { GetAppointmentByIdUseCase } from "./application/use-cases/get-appointment-by-id.use-case";
import { GetAppointmentByUserIdUseCase } from "./application/use-cases/get-appointment-by-user-id.use-case";
import { UpdateAppointmentStatusUseCase } from "./application/use-cases/update-appointment-status.use-case";
import { AppointmentRepository } from "./domain/repositories/appointment.repository";
import { PrismaAppointmentRepository } from "./infra/database/repositories/prisma-appointment.repository";
import { AppointmentController } from "./infra/http/controllers/appointment.controller";
import { AppointmentStatusListener } from "./infra/listeners/appointment-status.listener";
import { AppointmentReminderJob } from "./infra/jobs/appointment-reminder.job";

@Module({
	imports: [NotificationModule, StaffModule],
	providers: [
		GetAppointmentByIdUseCase,
		GetAppointmentByUserIdUseCase,
		GetAppointmentByCompanyIdUseCase,
		UpdateAppointmentStatusUseCase,
		AppointmentStatusListener,
		AppointmentReminderJob,
		{ provide: AppointmentRepository, useClass: PrismaAppointmentRepository },
	],
	controllers: [AppointmentController],
	exports: [
		{ provide: AppointmentRepository, useClass: PrismaAppointmentRepository },
	],
})
export class AppointmentModule {}
