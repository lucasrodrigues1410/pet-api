import { Injectable } from "@nestjs/common";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { StaffRepository } from "@/modules/staff/domain/repositories/staff.repository";
import { Either, left, right } from "@/shared/either";
import { NotAllowedError } from "@/shared/errors/errors/not-allowed.error";
import { DashboardMetrics } from "../../domain/entities/dashboard-metrics.entity";
import { DashboardMetricsService } from "../services/dashboard-metrics.service";

export interface GetDashboardMetricsRequest {
	userId: string;
	companyId: string;
	startDate?: Date;
	endDate?: Date;
}

type GetDashboardMetricsResponse = Either<NotAllowedError, DashboardMetrics>;

@Injectable()
export class GetDashboardMetricsUseCase {
	constructor(
		private readonly dashboardMetricsService: DashboardMetricsService,
		private readonly staffRepository: StaffRepository,
	) {}

	async execute(
		request: GetDashboardMetricsRequest,
	): Promise<GetDashboardMetricsResponse> {
		const { companyId, userId, startDate, endDate } = request;
		const staffMember = await this.staffRepository.findByUserId(
			userId,
			companyId,
		);

		if (!staffMember) {
			return left(new NotAllowedError("User does not belong to the company"));
		}

		const result = await this.dashboardMetricsService.getDashboardMetrics({
			companyId: new UniqueEntityID(companyId),
			startDate,
			endDate,
		});
		return right(result);
	}
}
