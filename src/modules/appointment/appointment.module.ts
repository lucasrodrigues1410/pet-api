import { Module } from "@nestjs/common";
import { CompanyRepository } from "@/modules/company/domain/repositories/company.repository";
import { PrismaCompanyRepository } from "@/modules/company/infra/database/repositories/prisma-company.repository";
import { StaffRepository } from "@/modules/staff/domain/repositories/staff.repository";
import { PrismaStaffRepository } from "@/modules/staff/infra/database/repositories/prisma-staff.repository";
import { StaffModule } from "../staff/staff.module";
import { GetAppointmentByCompanyIdUseCase } from "./application/use-cases/get-appointment-by-company-id.use-case";
import { GetAppointmentByIdUseCase } from "./application/use-cases/get-appointment-by-id.use-case";
import { GetAppointmentByUserIdUseCase } from "./application/use-cases/get-appointment-by-user-id.use-case";
import { AppointmentPolicy } from "./domain/policies/appointment.policy";
import { AppointmentRepository } from "./domain/repositories/appointment.repository";
import { PrismaAppointmentRepository } from "./infra/database/repositories/prisma-appointment.repository";
import { AppointmentController } from "./infra/http/controllers/appointment.controller";
import { AppointmentPolicyImpl } from "./infra/policies/appointment-policy";

@Module({
	imports: [StaffModule],
	providers: [
		GetAppointmentByIdUseCase,
		GetAppointmentByUserIdUseCase,
		GetAppointmentByCompanyIdUseCase,
		{
			provide: AppointmentRepository,
			useClass: PrismaAppointmentRepository,
		},
		{
			provide: CompanyRepository,
			useClass: PrismaCompanyRepository,
		},
		{
			provide: StaffRepository,
			useClass: PrismaStaffRepository,
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
