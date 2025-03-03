import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { LoginUseCase } from "./application/use-cases/login.use-case";
import { TokenGeneratorService } from "./infrastructure/security/token-generator.service";
import { BcryptPasswordHasher } from "./infrastructure/security/password-hasher.service";
import { AuthController } from "./presentation/controllers/auth.controller";
import { UserModule } from "../user/user.module";
import { VerifyTokenUseCase } from "./application/use-cases/verify-token.use-case";
import { RegisterUseCase } from "./application/use-cases/register.use-case";

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
		RegisterUseCase,
		VerifyTokenUseCase,
		{
			provide: "IPasswordHasher",
			useClass: BcryptPasswordHasher,
		},
		{
            provide: "ITokenGenerator",
            useClass: TokenGeneratorService,
        },
	],
	exports: [
		VerifyTokenUseCase,
	]
})
export class AuthModule {}
