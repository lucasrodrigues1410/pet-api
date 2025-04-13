import { Module } from "@nestjs/common";
import { StaffRepository } from "./domain/repositories/staff.repository";
import { PrismaStaffRepository } from "./infra/database/repositories/prisma-staff.repository";
@Module({
	imports: [],
	controllers: [],
	providers: [
		{
			provide: StaffRepository,
			useClass: PrismaStaffRepository
		},
	],
	exports: [
		{
			provide: StaffRepository,
			useClass: PrismaStaffRepository
		},
	]
})
export class StaffModule {}
