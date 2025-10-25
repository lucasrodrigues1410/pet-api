import { Controller, Get, Query } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ZodResponse } from "nestjs-zod";
import { User } from "@/modules/auth/infra/http/decorators/user.decorator";
import { GetDashboardMetricsUseCase } from "@/modules/dashboard/application/use-cases/get-dashboard-metrics.use-case";
import { GetDashboardPerformanceUseCase } from "@/modules/dashboard/application/use-cases/get-dashboard-performance.use-case";
import { DashboardQueryDto } from "../dtos/dashboard.query.dto";
import {
	DashboardMetricsResponse,
	WeeklyPerformanceResponse,
} from "../dtos/dashboard.response.dto";
import { DashboardMetricsPresenter } from "../presenters/dashboard-metrics.presenter";
import { WeeklyPerformancePresenter } from "../presenters/weekly-performance.presenter";

@ApiTags("Dashboard")
@Controller("dashboard")
export class DashboardController {
	constructor(
		private readonly getDashboardMetricsUseCase: GetDashboardMetricsUseCase,
		private readonly getDashboardPerformanceUseCase: GetDashboardPerformanceUseCase,
	) {}

	@Get("metrics")
	@ApiOperation({
		summary: "Obter métricas do dashboard",
		operationId: "getDashboardMetrics",
		description:
			"Retorna as principais métricas do dashboard: agendamentos hoje, faturamento mensal, clientes ativos e avaliação média",
	})
	@ZodResponse({ status: 200, type: DashboardMetricsResponse })
	async getDashboardMetrics(
		@Query() query: DashboardQueryDto,
		@User("sub") userId: string,
	): Promise<DashboardMetricsResponse> {
		const metrics = await this.getDashboardMetricsUseCase.execute({
			userId,
			startDate: query.startDate ? new Date(query.startDate) : undefined,
			endDate: query.endDate ? new Date(query.endDate) : undefined,
		});

		return DashboardMetricsPresenter.present(metrics);
	}

	@Get("performance")
	@ApiOperation({
		summary: "Obter performance semanal",
		operationId: "getWeeklyPerformance",
		description:
			"Retorna métricas de performance da semana: agendamentos, taxa de conversão e satisfação",
	})
	@ZodResponse({ status: 200, type: WeeklyPerformanceResponse })
	async getWeeklyPerformance(
		@User("sub") userId: string,
		@Query() query: DashboardQueryDto,
	): Promise<WeeklyPerformanceResponse> {
		const performance = await this.getDashboardPerformanceUseCase.execute({
			userId,
			startDate: query.startDate ? new Date(query.startDate) : undefined,
			endDate: query.endDate ? new Date(query.endDate) : undefined,
		});

		return WeeklyPerformancePresenter.present(performance);
	}
}
