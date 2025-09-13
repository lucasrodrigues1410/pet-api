import { RatingMetric } from "@/modules/dashboard/domain/value-objects/rating-metric";

export class RatingMetricPresenter {
	static present(metric: RatingMetric) {
		return {
			rating: metric.rating,
			changePercentage: metric.changePercentage,
			baseCount: metric.baseCount,
		};
	}
}
