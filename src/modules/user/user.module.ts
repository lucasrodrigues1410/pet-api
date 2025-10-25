import { Module } from "@nestjs/common";
import { UserRepository } from "./domain/repositories/user.repository";
import { PrismaUserRepository } from "./infra/database/repositories/prisma-user.repository";
import { UserController } from "./infra/http/controllers/user.controller";

@Module({
	controllers: [UserController],
	providers: [{ provide: UserRepository, useClass: PrismaUserRepository }],
	exports: [{ provide: UserRepository, useClass: PrismaUserRepository }],
})
export class UserModule {}
