import { ValueObject } from "@/core/domain/entities/value-object";

export interface ConversionRateProps {
	rate: number;
	changePercentage: number;
}

export class ConversionRate extends ValueObject<ConversionRateProps> {
	get rate() {
		return this.props.rate;
	}

	get changePercentage() {
		return this.props.changePercentage;
	}

	private constructor(props: ConversionRateProps) {
		super(props);
	}

	static create(rate: number, changePercentage: number): ConversionRate {
		if (rate < 0 || rate > 100) {
			throw new Error("Rate must be between 0 and 100");
		}

		return new ConversionRate({
			rate,
			changePercentage,
		});
	}
}
