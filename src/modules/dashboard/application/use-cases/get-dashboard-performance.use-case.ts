import { Injectable } from "@nestjs/common";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { StaffRepository } from "@/modules/staff/domain/repositories/staff.repository";
import { Either, left, right } from "@/shared/either";
import { NotAllowedError } from "@/shared/errors/errors/not-allowed.error";
import { WeeklyPerformance } from "../../domain/entities/weekly-performance.entity";
import { DashboardMetricsService } from "../services/dashboard-metrics.service";

export interface GetDashboardPerformanceRequest {
	userId: string;
	companyId: string;
	startDate?: Date;
	endDate?: Date;
}
type GetDashboardPerformanceResponse = Either<
	NotAllowedError,
	WeeklyPerformance
>;

@Injectable()
export class GetDashboardPerformanceUseCase {
	constructor(
		private readonly dashboardMetricsService: DashboardMetricsService,
		private readonly staffRepository: StaffRepository,
	) {}

	async execute(
		request: GetDashboardPerformanceRequest,
	): Promise<GetDashboardPerformanceResponse> {
		const { companyId, userId, startDate, endDate } = request;
		const staffMember = await this.staffRepository.findByUserId(
			userId,
			companyId,
		);

		if (!staffMember) {
			return left(new NotAllowedError("User does not belong to the company"));
		}

		const result = await this.dashboardMetricsService.getWeeklyPerformance({
			companyId: new UniqueEntityID(companyId),
			startDate,
			endDate,
		});
		return right(result);
	}
}
