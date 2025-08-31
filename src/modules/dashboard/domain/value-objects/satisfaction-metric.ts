import { ValueObject } from "@/core/domain/entities/value-object";

export interface SatisfactionMetricProps {
	rating: number;
	baseCount: number;
}

export class SatisfactionMetric extends ValueObject<SatisfactionMetricProps> {
	get rating() {
		return this.props.rating;
	}

	get baseCount() {
		return this.props.baseCount;
	}

	private constructor(props: SatisfactionMetricProps) {
		super(props);
	}

	static create(rating: number, baseCount: number): SatisfactionMetric {
		if (rating < 0 || rating > 5) {
			throw new Error("Rating must be between 0 and 5");
		}
		if (baseCount < 0) {
			throw new Error("Base count must be non-negative");
		}

		return new SatisfactionMetric({
			rating,
			baseCount,
		});
	}
}
