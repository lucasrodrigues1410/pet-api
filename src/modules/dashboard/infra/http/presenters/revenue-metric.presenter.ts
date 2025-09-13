import { RevenueMetric } from "@/modules/dashboard/domain/value-objects/revenue-metric";

export class RevenueMetricPresenter {
	static present(metric: RevenueMetric) {
		return { amount: metric.amount, changePercentage: metric.changePercentage };
	}
}
