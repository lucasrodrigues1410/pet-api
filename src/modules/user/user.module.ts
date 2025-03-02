import { Module } from "@nestjs/common";
import { UserController } from "./presentation/controllers/user.controller";
import { FindUserByIdUseCase } from "./application/use-cases/find-user-by-id.use-case";
import { UserPrismaRepository } from "./infrastructure/user-prisma.repository";
import { IUserRepository } from "./domain/repositories/user.repository";

@Module({
	controllers: [UserController],
	providers: [
		FindUserByIdUseCase,
		{
			provide: IUserRepository,
			useClass: UserPrismaRepository,
		},
	],
	exports: [
		{
			provide: IUserRepository,
			useClass: UserPrismaRepository,
		},
	],
})
export class UserModule {}
