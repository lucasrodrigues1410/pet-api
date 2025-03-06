import { Module } from "@nestjs/common";
import { FindUserByIdUseCase } from "./application/use-cases/find-user-by-id.use-case";
import { UserRepository } from "./domain/repositories/user.repository";
import { UserPrismaRepository } from "./infrastructure/database/prisma/repositories/user.repository";
import { UserController } from "./presentation/controllers/user.controller";

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
