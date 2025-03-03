import { Module } from "@nestjs/common";
import { UserController } from "./interface/controllers/user.controller";
import { FindUserByIdUseCase } from "./application/use-cases/find-user-by-id.use-case";
import { UserPrismaRepository } from "./infrastructure/database/prisma/user-prisma.repository";
import { UserRepository } from "./domain/repositories/user.repository";

@Module({
	controllers: [UserController],
	providers: [
		FindUserByIdUseCase,
		{
			provide: UserRepository,
			useClass: UserPrismaRepository,
		},
	],
	exports: [
		{
			provide: UserRepository,
			useClass: UserPrismaRepository,
		},
	],
})
export class UserModule {}
