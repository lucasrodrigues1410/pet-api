import { Injectable } from "@nestjs/common";
import { WeeklyPerformance } from "@/modules/dashboard/domain/entities/weekly-performance.entity";
import { StaffRepository } from "@/modules/staff/domain/repositories/staff.repository";
import { DashboardMetricsService } from "../services/dashboard-metrics.service";

export interface GetDashboardPerformanceRequest {
	userId: string;
	startDate?: Date;
	endDate?: Date;
}

@Injectable()
export class GetDashboardPerformanceUseCase {
	constructor(
		private readonly dashboardMetricsService: DashboardMetricsService,
		private readonly staffRepository: StaffRepository,
	) {}

	async execute(
		request: GetDashboardPerformanceRequest,
	): Promise<WeeklyPerformance> {
		const { userId, startDate, endDate } = request;
		const staff = await this.staffRepository.findByUserId(userId);
		if (!staff) {
			throw new Error("Staff not found for the given user ID");
		}

		return this.dashboardMetricsService.getWeeklyPerformance({
			companyId: staff.companyId,
			startDate,
			endDate,
		});
	}
}
