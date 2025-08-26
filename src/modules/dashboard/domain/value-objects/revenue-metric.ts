import { ValueObject } from "@/core/domain/entities/value-object";

export interface RevenueMetricProps {
	amount: number;
	changePercentage: number;
}

export class RevenueMetric extends ValueObject<RevenueMetricProps> {
	get amount() {
		return this.props.amount;
	}

	get changePercentage() {
		return this.props.changePercentage;
	}

	private constructor(props: RevenueMetricProps) {
		super(props);
	}

	static create(amount: number, changePercentage: number): RevenueMetric {
		if (amount < 0) {
			throw new Error("Amount must be non-negative");
		}

		return new RevenueMetric({
			amount,
			changePercentage,
		});
	}
}
