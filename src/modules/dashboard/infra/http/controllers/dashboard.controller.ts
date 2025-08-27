import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ZodResponse } from "nestjs-zod";
import { User } from "@/modules/auth/infra/http/decorators/user.decorator";
import { UserTypeDecorator } from "@/modules/auth/infra/http/decorators/user-type.decorator";
import { CompanyGuard } from "@/modules/company/infra/http/guards/company.guard";
import { GetDashboardMetricsUseCase } from "@/modules/dashboard/application/use-cases/get-dashboard-metrics.use-case";
import { GetDashboardPerformanceUseCase } from "@/modules/dashboard/application/use-cases/get-dashboard-performance.use-case";
import { UserType } from "@/modules/user/domain/entities/user.entity";
import { DashboardQueryDto } from "../dtos/dashboard.query.dto";
import {
	DashboardMetricsResponse,
	WeeklyPerformanceResponse,
} from "../dtos/dashboard.response.dto";

@ApiTags("Dashboard")
@Controller("dashboard")
@UserTypeDecorator(UserType.COMPANY)
@UseGuards(CompanyGuard)
export class DashboardController {
	constructor(
		private readonly getDashboardMetricsUseCase: GetDashboardMetricsUseCase,
		private readonly getDashboardPerformanceUseCase: GetDashboardPerformanceUseCase,
	) {}

	@Get("metrics")
	@ApiOperation({
		summary: "Obter métricas do dashboard",
		description:
			"Retorna as principais métricas do dashboard: agendamentos hoje, faturamento mensal, clientes ativos e avaliação média",
	})
	@ZodResponse({ type: DashboardMetricsResponse })
	async getDashboardMetrics(
		@Query() query: DashboardQueryDto,
		@User("companyId") companyId: string,
	): Promise<DashboardMetricsResponse> {
		const metrics = await this.getDashboardMetricsUseCase.execute({
			companyId,
			startDate: query.startDate ? new Date(query.startDate) : undefined,
			endDate: query.endDate ? new Date(query.endDate) : undefined,
		});

		return {
			appointmentsToday: {
				count: metrics.appointmentsToday.count,
				changePercentage: metrics.appointmentsToday.changePercentage,
			},
			monthlyRevenue: {
				amount: metrics.monthlyRevenue.amount,
				changePercentage: metrics.monthlyRevenue.changePercentage,
			},
			activeClients: {
				count: metrics.activeClients.count,
				changePercentage: metrics.activeClients.changePercentage,
			},
			averageRating: {
				rating: metrics.averageRating.rating,
				changePercentage: metrics.averageRating.changePercentage,
				baseCount: metrics.averageRating.baseCount,
			},
		};
	}

	@Get("performance")
	@ApiOperation({
		summary: "Obter performance semanal",
		description:
			"Retorna métricas de performance da semana: agendamentos, taxa de conversão e satisfação",
	})
	@ZodResponse({ type: WeeklyPerformanceResponse })
	async getWeeklyPerformance(
		@User("companyId") companyId: string,
		@Query() query: DashboardQueryDto,
	): Promise<WeeklyPerformanceResponse> {
		const performance = await this.getDashboardPerformanceUseCase.execute({
			companyId,
			startDate: query.startDate ? new Date(query.startDate) : undefined,
			endDate: query.endDate ? new Date(query.endDate) : undefined,
		});

		return {
			appointments: {
				completed: performance.appointments.completed,
				total: performance.appointments.total,
				percentage: performance.appointments.percentage,
			},
			conversionRate: {
				rate: performance.conversionRate.rate,
				changePercentage: performance.conversionRate.changePercentage,
			},
			satisfaction: {
				rating: performance.satisfaction.rating,
				baseCount: performance.satisfaction.baseCount,
			},
		};
	}
}
