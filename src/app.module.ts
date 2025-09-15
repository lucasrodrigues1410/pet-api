import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { CqrsModule } from "@nestjs/cqrs";
import { ZodSerializerInterceptor, ZodValidationPipe } from "nestjs-zod";
import { BullEventDispatcherModule } from "./core/infra/bull/bull-event-dispatcher.module";
import { envSchema } from "./core/infra/env/env";
import { EnvModule } from "./core/infra/env/env.module";
import { PrismaModule } from "./core/infra/prisma/prisma.module";
import { AnimalModule } from "./modules/animal/animal.module";
import { AppointmentModule } from "./modules/appointment/appointment.module";
import { AssetModule } from "./modules/asset/asset.module";
import { AuthModule } from "./modules/auth/auth.module";
import { JwtGuard } from "./modules/auth/infra/http/guards/jwt.guard";
import { BookingModule } from "./modules/booking/booking.module";
import { BreedModule } from "./modules/breed/breed.module";
import { CategoryModule } from "./modules/category/category.module";
import { CompanyModule } from "./modules/company/company.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";
import { EmailModule } from "./modules/email/email.module";
import { HealthModule } from "./modules/health/health.module";
import { InviteModule } from "./modules/invite/invite.module";
import { NotificationModule } from "./modules/notification/notification.module";
import { RatingModule } from "./modules/rating/rating.module";
import { ServiceModule } from "./modules/service/service.module";
import { StaffModule } from "./modules/staff/staff.module";
import { UserModule } from "./modules/user/user.module";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validate: (env) => envSchema.parse(env),
			cache: true,
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
		CategoryModule,
		AssetModule,
		CompanyModule,
		AppointmentModule,
		BookingModule,
		StaffModule,
		InviteModule,
		NotificationModule,
		DashboardModule,
		RatingModule,
		HealthModule,
	],
	providers: [
		{ provide: APP_PIPE, useClass: ZodValidationPipe },
		{ provide: APP_GUARD, useClass: JwtGuard },
		{ provide: APP_INTERCEPTOR, useClass: ZodSerializerInterceptor },
	],
})
export class AppModule {}
