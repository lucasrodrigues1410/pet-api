import { Injectable } from "@nestjs/common";
import { DashboardMetrics } from "@/modules/dashboard/domain/entities/dashboard-metrics.entity";
import { WeeklyPerformance } from "@/modules/dashboard/domain/entities/weekly-performance.entity";
import {
	DashboardFilters,
	DashboardRepository,
} from "@/modules/dashboard/domain/interfaces/dashboard.repository.interface";

@Injectable()
export class DashboardMetricsService {
	constructor(private readonly dashboardRepository: DashboardRepository) {}

	async getDashboardMetrics(
		filters: DashboardFilters,
	): Promise<DashboardMetrics> {
		return this.dashboardRepository.getDashboardMetrics(filters);
	}

	async getWeeklyPerformance(
		filters: DashboardFilters,
	): Promise<WeeklyPerformance> {
		return this.dashboardRepository.getWeeklyPerformance(filters);
	}

	async getFullDashboardData(filters: DashboardFilters) {
		const [metrics, performance] = await Promise.all([
			this.getDashboardMetrics(filters),
			this.getWeeklyPerformance(filters),
		]);

		return { metrics, performance };
	}
}
