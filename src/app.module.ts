import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD, APP_PIPE } from "@nestjs/core";
import { ZodValidationPipe } from "nestjs-zod";
import { PrismaModule } from "./common/infrastructure/prisma/prisma.module";
import { AnimalModule } from "./modules/animal/animal.module";
import { AuthModule } from "./modules/auth/auth.module";
import { JwtStrategy } from "./modules/auth/infrastructure/strategies/jwt.strategy";
import { JwtGuard } from "./modules/auth/presentation/guards/jwt.guard";
import { UserModule } from "./modules/user/user.module";
import { ServiceModule } from "./modules/service/service.module";

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		PrismaModule,
		AuthModule,
		UserModule,
		AnimalModule,
		ServiceModule
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
