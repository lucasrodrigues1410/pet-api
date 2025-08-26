import { Injectable } from "@nestjs/common";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { DashboardMetrics } from "@/modules/dashboard/domain/entities/dashboard-metrics.entity";
import { DashboardMetricsService } from "../services/dashboard-metrics.service";

export interface GetDashboardMetricsRequest {
	companyId: string;
	startDate?: Date;
	endDate?: Date;
}

@Injectable()
export class GetDashboardMetricsUseCase {
	constructor(
		private readonly dashboardMetricsService: DashboardMetricsService,
	) {}

	async execute(
		request: GetDashboardMetricsRequest,
	): Promise<DashboardMetrics> {
		const { companyId, startDate, endDate } = request;

		return this.dashboardMetricsService.getDashboardMetrics({
			companyId: new UniqueEntityID(companyId),
			startDate,
			endDate,
		});
	}
}
