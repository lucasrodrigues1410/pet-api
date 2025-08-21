import { Module } from "@nestjs/common";
import { UpdateUserProfileUseCase } from "./application/use-cases/update-user-profile.use-case";
import { UserRepository } from "./domain/repositories/user.repository";
import { PrismaUserRepository } from "./infra/database/repositories/prisma-user.repository";
import { UserController } from "./infra/http/controllers/user.controller";

@Module({
	controllers: [UserController],
	providers: [
		UpdateUserProfileUseCase,
		{
			provide: UserRepository,
			useClass: PrismaUserRepository,
		},
	],
	exports: [
		{
			provide: UserRepository,
			useClass: PrismaUserRepository,
		},
	],
})
export class UserModule {}
