import { Module } from "@nestjs/common";
import { AppointmentModule } from "../appointment/appointment.module";
import { CompanyModule } from "../company/company.module";
import { ServiceModule } from "../service/service.module";
import { UserModule } from "../user/user.module";
import { DashboardMetricsService } from "./application/services/dashboard-metrics.service";
import { GetDashboardMetricsUseCase } from "./application/use-cases/get-dashboard-metrics.use-case";
import { GetDashboardPerformanceUseCase } from "./application/use-cases/get-dashboard-performance.use-case";
import { DashboardRepository } from "./domain/interfaces/dashboard.repository.interface";
import { PrismaDashboardRepository } from "./infra/database/repositories/prisma-dashboard.repository";
import { DashboardController } from "./infra/http/controllers/dashboard.controller";

@Module({
	imports: [AppointmentModule, UserModule, CompanyModule, ServiceModule],
	controllers: [DashboardController],
	providers: [
		{
			provide: DashboardRepository,
			useClass: PrismaDashboardRepository,
		},
		DashboardMetricsService,
		GetDashboardMetricsUseCase,
		GetDashboardPerformanceUseCase,
	],
	exports: [
		DashboardMetricsService,
		GetDashboardMetricsUseCase,
		GetDashboardPerformanceUseCase,
	],
})
export class DashboardModule {}
