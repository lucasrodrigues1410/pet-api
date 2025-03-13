import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "../user/user.module";
import { LoginUseCase } from "./application/use-cases/login.use-case";
import { RegisterUseCase } from "./application/use-cases/register.use-case";
import { Encrypter } from "./domain/interfaces/encrypter.interface";
import { HashComparer } from "./domain/interfaces/hash-comparer.interface";
import { HashGenerator } from "./domain/interfaces/hash-generator.interface";
import { BcryptHasher } from "./infra/security/bcrypt-hasher.service";
import { JwtEncrypter } from "./infra/security/jwt-encrypter.service";
import { JwtStrategy } from "./infra/strategies/jwt.strategy";
import { AuthController } from "./infra/http/controllers/auth.controller";

@Module({
	imports: [
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get<string>("JWT_SECRET")!,
			}),
			inject: [ConfigService],
		}),
		UserModule,
	],
	controllers: [AuthController],
	providers: [
		JwtStrategy,
		LoginUseCase,
		RegisterUseCase,
		{ provide: Encrypter, useClass: JwtEncrypter },
		{ provide: HashComparer, useClass: BcryptHasher },
		{ provide: HashGenerator, useClass: BcryptHasher },
	],
})
export class AuthModule {}
