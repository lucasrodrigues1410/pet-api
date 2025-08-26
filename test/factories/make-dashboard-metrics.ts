import { faker } from "@faker-js/faker";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import {
	DashboardMetrics,
	DashboardMetricsProps,
} from "@/modules/dashboard/domain/entities/dashboard-metrics.entity";
import { MetricWithChange } from "@/modules/dashboard/domain/value-objects/metric-with-change";
import { RatingMetric } from "@/modules/dashboard/domain/value-objects/rating-metric";
import { RevenueMetric } from "@/modules/dashboard/domain/value-objects/revenue-metric";

export function makeDashboardMetrics(
	override: Partial<DashboardMetricsProps> = {},
	id?: UniqueEntityID,
): DashboardMetrics {
	const appointmentsToday = faker.number.int({ min: 0, max: 50 });
	const monthlyRevenue = faker.number.float({
		min: 1000,
		max: 10000,
		fractionDigits: 2,
	});
	const activeClients = faker.number.int({ min: 50, max: 500 });
	const rating = faker.number.float({ min: 3.0, max: 5.0, fractionDigits: 1 });
	const baseCount = faker.number.int({ min: 10, max: 100 });

	const defaultProps: DashboardMetricsProps = {
		companyId: new UniqueEntityID(),
		appointmentsToday: MetricWithChange.create(
			appointmentsToday,
			faker.number.float({ min: -20, max: 50, fractionDigits: 1 }),
		),
		monthlyRevenue: RevenueMetric.create(
			monthlyRevenue,
			faker.number.float({ min: -10, max: 30, fractionDigits: 1 }),
		),
		activeClients: MetricWithChange.create(
			activeClients,
			faker.number.float({ min: -5, max: 25, fractionDigits: 1 }),
		),
		averageRating: RatingMetric.create(
			rating,
			faker.number.float({ min: -1, max: 1, fractionDigits: 1 }),
			baseCount,
		),
		generatedAt: faker.date.recent(),
		...override,
	};

	return DashboardMetrics.create(defaultProps, id);
}

export function makeDashboardMetricsWithSpecificData(data: {
	companyId?: UniqueEntityID;
	appointmentsToday?: number;
	appointmentsChange?: number;
	monthlyRevenue?: number;
	revenueChange?: number;
	activeClients?: number;
	clientsChange?: number;
	averageRating?: number;
	ratingChange?: number;
	baseCount?: number;
}): DashboardMetrics {
	return makeDashboardMetrics({
		companyId: data.companyId || new UniqueEntityID(),
		appointmentsToday: MetricWithChange.create(
			data.appointmentsToday || 12,
			data.appointmentsChange || 8.2,
		),
		monthlyRevenue: RevenueMetric.create(
			data.monthlyRevenue || 4850,
			data.revenueChange || 15.3,
		),
		activeClients: MetricWithChange.create(
			data.activeClients || 186,
			data.clientsChange || 12.1,
		),
		averageRating: RatingMetric.create(
			data.averageRating || 4.8,
			data.ratingChange || 0.2,
			data.baseCount || 42,
		),
	});
}


