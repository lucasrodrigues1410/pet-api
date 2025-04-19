import { Module } from "@nestjs/common";
import { GetAppointmentByIdUseCase } from "./application/use-cases/get-appointment-by-id.use-case";
import { AppointmentRepository } from "./domain/repositories/appointment.repository";
import { PrismaAppointmentRepository } from "./infra/database/repositories/prisma-appointment.repository";
import { AppointmentController } from "./infra/http/controllers/appointment.controller";
import { GetAppointmentByUserIdUseCase } from "./application/use-cases/get-appointment-by-user-id.use-case";
import { AppointmentPolicyImpl } from "./infra/policies/appointment-policy";
import { AppointmentPolicy } from "./domain/policies/appointment.policy";
import { StaffModule } from "../staff/staff.module";

@Module({
	imports: [StaffModule],
	providers: [
		GetAppointmentByIdUseCase,
		GetAppointmentByUserIdUseCase,
		{
			provide: AppointmentRepository,
			useClass: PrismaAppointmentRepository,
		},
		{
			provide: AppointmentPolicy,
			useClass: AppointmentPolicyImpl,
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
