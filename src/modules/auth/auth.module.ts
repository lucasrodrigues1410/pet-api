import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { EnvService } from "@/core/infra/env/env.service";
import { InviteModule } from "../invite/invite.module";
import { StaffModule } from "../staff/staff.module";
import { UserModule } from "../user/user.module";
import { AcceptInviteUseCase } from "./application/use-cases/accept-invite.use-case";
import { SignInUseCase } from "./application/use-cases/sign-in.use-case";
import { SignUpUseCase } from "./application/use-cases/sign-up.use-case";
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
			inject: [EnvService],
			useFactory: async (env: EnvService) => ({
				secret: env.get("JWT_SECRET")!,
			}),
		}),
		UserModule,
		StaffModule,
		InviteModule,
	],
	controllers: [AuthController],
	providers: [
		JwtStrategy,
		SignInUseCase,
		SignUpUseCase,
		AcceptInviteUseCase,
		{ provide: Encrypter, useClass: JwtEncrypter },
		{ provide: HashComparer, useClass: BcryptHasher },
		{ provide: HashGenerator, useClass: BcryptHasher },
	],
})
export class AuthModule {}
