import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD, APP_PIPE } from "@nestjs/core";
import { ZodValidationPipe } from "nestjs-zod";
import { PrismaModule } from "./core/infra/prisma/prisma.module";
import { AnimalModule } from "./modules/animal/animal.module";
import { AssetModule } from "./modules/asset/asset.module";
import { AuthModule } from "./modules/auth/auth.module";
import { JwtGuard } from "./modules/auth/infra/http/guards/jwt.guard";
import { JwtStrategy } from "./modules/auth/infra/strategies/jwt.strategy";
import { BreedModule } from "./modules/breed/breed.module";
import { CompanyModule } from "./modules/company/company.module";
import { PaymentModule } from "./modules/payment/payment.module";
import { PriceVariationModule } from "./modules/price-variation/price-variation.module";
import { SchedulingModule } from "./modules/scheduling/scheduling.module";
import { ServiceModule } from "./modules/service/service.module";
import { UserModule } from "./modules/user/user.module";

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		PrismaModule,
		AuthModule,
		UserModule,
		AnimalModule,
		ServiceModule,
		BreedModule,
		AssetModule,
		SchedulingModule,
		CompanyModule,
		PriceVariationModule,
		PaymentModule,
	],
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
