import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { LoginUseCase } from "./application/use-cases/login.use-case";
import { AuthController } from "./interface/controllers/auth.controller";
import { UserModule } from "../user/user.module";
import { RegisterUseCase } from "./application/use-cases/register.use-case";
import { JwtStrategy } from "./infrastructure/strategies/jwt.strategy";
import { Encrypter } from "./domain/interfaces/encrypter.interface";
import { HashComparer } from "./domain/interfaces/hash-comparer.interface";
import { JwtEncrypter } from "./infrastructure/security/jwt-encrypter.service";
import { BcryptHasher } from "./infrastructure/security/bcrypt-hasher.service";
import { HashGenerator } from "./domain/interfaces/hash-generator.interface";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
	imports: [
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
			  secret: configService.get<string>('JWT_SECRET')!,
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
