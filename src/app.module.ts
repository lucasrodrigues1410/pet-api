import { ZodValidationPipe } from "@anatine/zod-nestjs";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD, APP_PIPE } from "@nestjs/core";
import { CqrsModule } from "@nestjs/cqrs";
import { BullEventDispatcherModule } from "./core/infra/bull/bull-event-dispatcher.module";
import { envSchema } from "./core/infra/env/env";
import { EnvModule } from "./core/infra/env/env.module";
import { PrismaModule } from "./core/infra/prisma/prisma.module";
import { AnimalModule } from "./modules/animal/animal.module";
import { AppointmentModule } from "./modules/appointment/appointment.module";
import { AssetModule } from "./modules/asset/asset.module";
import { AuthModule } from "./modules/auth/auth.module";
import { JwtGuard } from "./modules/auth/infra/http/guards/jwt.guard";
import { JwtStrategy } from "./modules/auth/infra/strategies/jwt.strategy";
import { BookingModule } from "./modules/booking/booking.module";
import { BreedModule } from "./modules/breed/breed.module";
import { CompanyModule } from "./modules/company/company.module";
import { EmailModule } from "./modules/email/email.module";
import { NotificationModule } from "./modules/notification/notification.module";
import { PaymentModule } from "./modules/payment/payment.module";
import { PriceVariationModule } from "./modules/price-variation/price-variation.module";
import { ServiceModule } from "./modules/service/service.module";
import { StaffModule } from "./modules/staff/staff.module";
import { UserModule } from "./modules/user/user.module";
import { CacheModule } from "./core/infra/cache/cache.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validate: (env) => envSchema.parse(env),
		}),
		CqrsModule.forRoot(),
		EnvModule,
		EmailModule,
		BullEventDispatcherModule,
		PrismaModule,
		AuthModule,
		UserModule,
		AnimalModule,
		ServiceModule,
		BreedModule,
		AssetModule,
		CompanyModule,
		PriceVariationModule,
		PaymentModule,
		AppointmentModule,
		BookingModule,
		StaffModule,
		NotificationModule,
	],
	providers: [
		{
			provide: APP_PIPE,
			useClass: ZodValidationPipe,
		},
		// JwtStrategy,
		// {
		// 	provide: APP_GUARD,
		// 	useClass: JwtGuard,
		// },
	],
})
export class AppModule {}
