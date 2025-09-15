import { ValueObject } from "@/core/domain/entities/value-object";

export interface RatingMetricProps {
	rating: number;
	changePercentage: number;
	baseCount: number;
}

export class RatingMetric extends ValueObject<RatingMetricProps> {
	get rating() {
		return this.props.rating;
	}

	get changePercentage() {
		return this.props.changePercentage;
	}

	get baseCount() {
		return this.props.baseCount;
	}

	private constructor(props: RatingMetricProps) {
		super(props);
	}

	static create(
		rating: number,
		changePercentage: number,
		baseCount: number,
	): RatingMetric {
		if (rating < 0 || rating > 5) {
			throw new Error("Rating must be between 0 and 5");
		}
		if (baseCount < 0) {
			throw new Error("Base count must be non-negative");
		}

		return new RatingMetric({ rating, changePercentage, baseCount });
	}
}
