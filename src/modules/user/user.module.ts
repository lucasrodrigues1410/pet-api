import { Module } from "@nestjs/common";
import { AssetModule } from "../asset/asset.module";
import { StaffModule } from "../staff/staff.module";
import { ListCompanyClientsUseCase } from "./application/use-cases/list-company-clients.use-case";
import { UserRepository } from "./domain/repositories/user.repository";
import { PrismaUserRepository } from "./infra/database/repositories/prisma-user.repository";
import { UserController } from "./infra/http/controllers/user.controller";

@Module({
	imports: [AssetModule, StaffModule],
	controllers: [UserController],
	providers: [
		ListCompanyClientsUseCase,
		{ provide: UserRepository, useClass: PrismaUserRepository },
	],
	exports: [{ provide: UserRepository, useClass: PrismaUserRepository }],
})
export class UserModule {}
