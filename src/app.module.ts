import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD, APP_PIPE } from "@nestjs/core";
import { ZodValidationPipe } from "nestjs-zod";
import { PrismaModule } from "./core/infra/prisma/prisma.module";
import { AnimalModule } from "./modules/animal/animal.module";
import { AuthModule } from "./modules/auth/auth.module";
import { JwtStrategy } from "./modules/auth/infra/strategies/jwt.strategy";
import { JwtGuard } from "./modules/auth/infra/http/guards/jwt.guard";
import { ServiceModule } from "./modules/service/service.module";
import { UserModule } from "./modules/user/user.module";
import { BreedModule } from "./modules/breed/breed.module";
import { companyModule } from "./modules/company/company.module";

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		PrismaModule,
		AuthModule,
		UserModule,
		AnimalModule,
		ServiceModule,
		BreedModule,
		companyModule
	],
	controllers: [],
	providers: [
		{
			provide: APP_PIPE,
			useClass: ZodValidationPipe,
		},
		JwtStrategy,
		{
			provide: APP_GUARD,
			useClass: JwtGuard,
		},
	],
})
export class AppModule {}
