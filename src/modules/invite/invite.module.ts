import { Module } from "@nestjs/common";
import { CompanyModule } from "../company/company.module";
import { EmailModule } from "../email/email.module";
import { StaffModule } from "../staff/staff.module";
import { UserModule } from "../user/user.module";
import { InviteEmployeeUseCase } from "./application/use-cases/invite-employee.use-case";
import { ValidateInviteUseCase } from "./application/use-cases/validate-invite.use-case";
import { InviteRepository } from "./domain/repositories/invite.repository";
import { PrismaInviteRepository } from "./infra/database/repositories/prisma-invite.repository";
import { InviteController } from "./infra/http/controllers/invite.controller";

@Module({
	imports: [CompanyModule, EmailModule, StaffModule, UserModule],
	controllers: [InviteController],
	providers: [
		InviteEmployeeUseCase,
		ValidateInviteUseCase,
		{ provide: InviteRepository, useClass: PrismaInviteRepository },
	],
	exports: [{ provide: InviteRepository, useClass: PrismaInviteRepository }],
})
export class InviteModule {}
