import { ValueObject } from "@/core/domain/entities/value-object";

export interface MetricWithChangeProps {
	count: number;
	changePercentage: number;
}

export class MetricWithChange extends ValueObject<MetricWithChangeProps> {
	get count() {
		return this.props.count;
	}

	get changePercentage() {
		return this.props.changePercentage;
	}

	private constructor(props: MetricWithChangeProps) {
		super(props);
	}

	static create(count: number, changePercentage: number): MetricWithChange {
		if (count < 0) {
			throw new Error("Count must be non-negative");
		}

		return new MetricWithChange({
			count,
			changePercentage,
		});
	}
}
