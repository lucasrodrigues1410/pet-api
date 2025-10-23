import { Injectable } from "@nestjs/common";
import { DashboardMetrics } from "@/modules/dashboard/domain/entities/dashboard-metrics.entity";
import { StaffRepository } from "@/modules/staff/domain/repositories/staff.repository";
import { DashboardMetricsService } from "../services/dashboard-metrics.service";

export interface GetDashboardMetricsRequest {
	userId: string;
	startDate?: Date;
	endDate?: Date;
}

@Injectable()
export class GetDashboardMetricsUseCase {
	constructor(
		private readonly dashboardMetricsService: DashboardMetricsService,
		private readonly staffRepository: StaffRepository,
	) {}

	async execute(
		request: GetDashboardMetricsRequest,
	): Promise<DashboardMetrics> {
		const { userId, startDate, endDate } = request;
		const staff = await this.staffRepository.findByUserId(userId);
		if (!staff?.companyId) {
			throw new Error("Company not found for the given user.");
		}

		return this.dashboardMetricsService.getDashboardMetrics({
			companyId: staff.companyId,
			startDate,
			endDate,
		});
	}
}
