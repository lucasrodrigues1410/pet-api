import { Module } from "@nestjs/common";
import { UserModule } from "../user/user.module";
import { CreateStaffUseCase } from "./application/use-cases/create-staff.use-case";
import { DeleteStaffUseCase } from "./application/use-cases/delete-staff.use-case";
import { GetStaffByUserIdUseCase } from "./application/use-cases/get-staff-by-user-id.use-case";
import { ListStaffByCompanyUseCase } from "./application/use-cases/list-staff-by-company.use-case";
import { StaffRepository } from "./domain/repositories/staff.repository";
import { PrismaStaffRepository } from "./infra/database/repositories/prisma-staff.repository";
import { StaffController } from "./infra/http/controllers/staff.controller";
@Module({
	imports: [UserModule],
	controllers: [StaffController],
	providers: [
		{ provide: StaffRepository, useClass: PrismaStaffRepository },
		ListStaffByCompanyUseCase,
		DeleteStaffUseCase,
		GetStaffByUserIdUseCase,
		CreateStaffUseCase,
	],
	exports: [
		{ provide: StaffRepository, useClass: PrismaStaffRepository },
		ListStaffByCompanyUseCase,
		GetStaffByUserIdUseCase,
		DeleteStaffUseCase,
	],
})
export class StaffModule {}
