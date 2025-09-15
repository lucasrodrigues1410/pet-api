import { SatisfactionMetric } from "@/modules/dashboard/domain/value-objects/satisfaction-metric";

export class SatisfactionMetricPresenter {
	static present(metric: SatisfactionMetric) {
		return { rating: metric.rating, baseCount: metric.baseCount };
	}
}
