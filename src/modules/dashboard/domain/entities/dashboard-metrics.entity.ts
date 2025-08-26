import { Entity } from "@/core/domain/entities/entity";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { MetricWithChange } from "../value-objects/metric-with-change";
import { RatingMetric } from "../value-objects/rating-metric";
import { RevenueMetric } from "../value-objects/revenue-metric";

export interface DashboardMetricsProps {
	companyId: UniqueEntityID;
	appointmentsToday: MetricWithChange;
	monthlyRevenue: RevenueMetric;
	activeClients: MetricWithChange;
	averageRating: RatingMetric;
	generatedAt: Date;
}

export class DashboardMetrics extends Entity<DashboardMetricsProps> {
	get companyId() {
		return this.props.companyId;
	}

	get appointmentsToday() {
		return this.props.appointmentsToday;
	}

	get monthlyRevenue() {
		return this.props.monthlyRevenue;
	}

	get activeClients() {
		return this.props.activeClients;
	}

	get averageRating() {
		return this.props.averageRating;
	}

	get generatedAt() {
		return this.props.generatedAt;
	}

	static create(
		props: Omit<DashboardMetricsProps, "generatedAt"> & {
			generatedAt?: Date;
		},
		id?: UniqueEntityID,
	): DashboardMetrics {
		return new DashboardMetrics(
			{
				...props,
				generatedAt: props.generatedAt ?? new Date(),
			},
			id,
		);
	}

	public toObject() {
		return {
			id: this.id.toString(),
			companyId: this.companyId.toString(),
			appointmentsToday: {
				count: this.appointmentsToday.count,
				changePercentage: this.appointmentsToday.changePercentage,
			},
			monthlyRevenue: {
				amount: this.monthlyRevenue.amount,
				changePercentage: this.monthlyRevenue.changePercentage,
			},
			activeClients: {
				count: this.activeClients.count,
				changePercentage: this.activeClients.changePercentage,
			},
			averageRating: {
				rating: this.averageRating.rating,
				changePercentage: this.averageRating.changePercentage,
				baseCount: this.averageRating.baseCount,
			},
			generatedAt: this.generatedAt.toISOString(),
		};
	}
}
