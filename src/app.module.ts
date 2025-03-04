import { Module } from "@nestjs/common";
import { PrismaModule } from "./common/infrastructure/prisma/prisma.module";
import { UserModule } from "./modules/user/user.module";
import { AuthModule } from "./modules/auth/auth.module";
import { APP_GUARD } from "@nestjs/core";
import { JwtGuard } from "./modules/auth/interface/guards/jwt.guard";
import { AnimalModule } from "./modules/animal/animal.module";
import { JwtStrategy } from "./modules/auth/infrastructure/strategies/jwt.strategy";
import { ConfigModule } from "@nestjs/config";

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		PrismaModule,
		AuthModule,
		UserModule,
		AnimalModule,
	],
	controllers: [],
	providers: [
		JwtStrategy,
		{
			provide: APP_GUARD,
			useClass: JwtGuard,
		},
	],
})
export class AppModule {}
