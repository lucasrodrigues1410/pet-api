import { Module } from "@nestjs/common";
import { AppointmentRepository } from "./domain/repositories/appointment.repository";
import { PrismaAppointmentRepository } from "./infra/database/repositories/prisma-appointment.repository";

@Module({
	providers: [
		{
			provide: AppointmentRepository,
			useClass: PrismaAppointmentRepository,
		},
	],
	exports: [
		{
			provide: AppointmentRepository,
			useClass: PrismaAppointmentRepository,
		},
	]
})
export class AppointmentModule {}
