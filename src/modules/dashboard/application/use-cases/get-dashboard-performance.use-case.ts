import { Injectable } from "@nestjs/common";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { WeeklyPerformance } from "@/modules/dashboard/domain/entities/weekly-performance.entity";
import { DashboardMetricsService } from "../services/dashboard-metrics.service";

export interface GetDashboardPerformanceRequest {
	companyId: string;
	startDate?: Date;
	endDate?: Date;
}

@Injectable()
export class GetDashboardPerformanceUseCase {
	constructor(
		private readonly dashboardMetricsService: DashboardMetricsService,
	) {}

	async execute(
		request: GetDashboardPerformanceRequest,
	): Promise<WeeklyPerformance> {
		const { companyId, startDate, endDate } = request;

		return this.dashboardMetricsService.getWeeklyPerformance({
			companyId: new UniqueEntityID(companyId),
			startDate,
			endDate,
		});
	}
}
