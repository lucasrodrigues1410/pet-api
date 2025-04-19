import { EnvModule } from "@/core/infra/env/env.module";
import { EnvService } from "@/core/infra/env/env.service";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "../user/user.module";
import { LoginUseCase } from "./application/use-cases/login.use-case";
import { RegisterUseCase } from "./application/use-cases/register.use-case";
import { Encrypter } from "./domain/interfaces/encrypter.interface";
import { HashComparer } from "./domain/interfaces/hash-comparer.interface";
import { HashGenerator } from "./domain/interfaces/hash-generator.interface";
import { AuthController } from "./infra/http/controllers/auth.controller";
import { BcryptHasher } from "./infra/security/bcrypt-hasher.service";
import { JwtEncrypter } from "./infra/security/jwt-encrypter.service";
import { JwtStrategy } from "./infra/strategies/jwt.strategy";

@Module({
	imports: [
		JwtModule.registerAsync({
			imports: [EnvModule],
			inject: [EnvService],
			global: true,
			useFactory: async (env: EnvService) => ({
				secret: env.get("JWT_SECRET")!,
			}),
		}),
		UserModule,
	],
	controllers: [AuthController],
	providers: [
		EnvService,
		JwtStrategy,
		LoginUseCase,
		RegisterUseCase,
		{ provide: Encrypter, useClass: JwtEncrypter },
		{ provide: HashComparer, useClass: BcryptHasher },
		{ provide: HashGenerator, useClass: BcryptHasher },
	],
})
export class AuthModule {}
