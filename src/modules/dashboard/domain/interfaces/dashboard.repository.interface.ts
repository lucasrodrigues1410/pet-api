import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { DashboardMetrics } from "../entities/dashboard-metrics.entity";
import { WeeklyPerformance } from "../entities/weekly-performance.entity";

export interface DashboardFilters {
	companyId: UniqueEntityID;
	startDate?: Date;
	endDate?: Date;
}

export abstract class DashboardRepository {
	abstract getDashboardMetrics(
		filters: DashboardFilters,
	): Promise<DashboardMetrics>;
	abstract getWeeklyPerformance(
		filters: DashboardFilters,
	): Promise<WeeklyPerformance>;
}
