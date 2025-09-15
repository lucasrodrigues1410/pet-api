import { Module } from "@nestjs/common";
import { DeleteStaffUseCase } from "./application/use-cases/delete-staff.use-case";
import { ListStaffByCompanyUseCase } from "./application/use-cases/list-staff-by-company.use-case";
import { StaffRepository } from "./domain/repositories/staff.repository";
import { PrismaStaffRepository } from "./infra/database/repositories/prisma-staff.repository";
import { StaffController } from "./infra/http/controllers/staff.controller";
@Module({
	imports: [],
	controllers: [StaffController],
	providers: [
		{ provide: StaffRepository, useClass: PrismaStaffRepository },
		ListStaffByCompanyUseCase,
		DeleteStaffUseCase,
	],
	exports: [
		{ provide: StaffRepository, useClass: PrismaStaffRepository },
		ListStaffByCompanyUseCase,
		DeleteStaffUseCase,
	],
})
export class StaffModule {}
