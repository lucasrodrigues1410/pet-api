import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { LoginUseCase } from "./application/use-cases/login.use-case";
import { TokenGeneratorService } from "./infrastructure/services/token-generator.service";
import { BcryptPasswordHasher } from "./infrastructure/services/bcrypt-password-hasher.service";
import { UserPrismaRepository } from "../user/infrastructure/user-prisma.repository";
import { IUserRepository } from "../user/domain/repositories/user.repository";
import { AuthController } from "./presentation/controllers/auth.controller";
import { UserModule } from "../user/user.module";

@Module({
	imports: [
		JwtModule.register({
			global: true,
			secret: "secret",
			signOptions: { expiresIn: "1d" },
		}),
		UserModule,
	],
	controllers: [AuthController],
	providers: [
		LoginUseCase,
		{
			provide: "IPasswordHasher",
			useClass: BcryptPasswordHasher,
		},
		{
            provide: "ITokenGenerator",
            useClass: TokenGeneratorService,
        },
	],
})
export class AuthModule {}
