import { DashboardMetrics } from "@/modules/dashboard/domain/entities/dashboard-metrics.entity";
import { MetricWithChangePresenter } from "./metric-with-change.presenter";
import { RatingMetricPresenter } from "./rating-metric.presenter";
import { RevenueMetricPresenter } from "./revenue-metric.presenter";

export class DashboardMetricsPresenter {
	static present(metrics: DashboardMetrics) {
		return {
			appointmentsToday: MetricWithChangePresenter.present(
				metrics.appointmentsToday,
			),
			monthlyRevenue: RevenueMetricPresenter.present(metrics.monthlyRevenue),
			activeClients: MetricWithChangePresenter.present(metrics.activeClients),
			averageRating: RatingMetricPresenter.present(metrics.averageRating),
		};
	}
}
