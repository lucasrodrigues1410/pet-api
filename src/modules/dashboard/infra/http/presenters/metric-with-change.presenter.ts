import { MetricWithChange } from "@/modules/dashboard/domain/value-objects/metric-with-change";

export class MetricWithChangePresenter {
	static present(metric: MetricWithChange) {
		return { count: metric.count, changePercentage: metric.changePercentage };
	}
}
