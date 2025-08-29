import { Module } from "@nestjs/common";
import { AssetModule } from "../asset/asset.module";
import { AddAssetToUserUseCase } from "./application/use-cases/add-asset-to-user.use-case";
import { UpdateUserProfileUseCase } from "./application/use-cases/update-user-profile.use-case";
import { UserRepository } from "./domain/repositories/user.repository";
import { PrismaUserRepository } from "./infra/database/repositories/prisma-user.repository";
import { UserController } from "./infra/http/controllers/user.controller";

@Module({
	imports: [AssetModule],
	controllers: [UserController],
	providers: [
		UpdateUserProfileUseCase,
		AddAssetToUserUseCase,
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
