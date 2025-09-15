import { ValueObject } from "@/core/domain/entities/value-object";

export interface PriceRangeProps {
	min: number;
	max: number;
}

export class PriceRange extends ValueObject<PriceRangeProps> {
	get min() {
		return this.props.min;
	}

	get max() {
		return this.props.max;
	}

	static empty(): PriceRange {
		return new PriceRange({ min: 0, max: 0 });
	}

	static create(props?: PriceRangeProps): PriceRange {
		if (!props) {
			return PriceRange.empty();
		}
		return new PriceRange(props);
	}

	public toObject() {
		return { min: this.min, max: this.max };
	}
}
