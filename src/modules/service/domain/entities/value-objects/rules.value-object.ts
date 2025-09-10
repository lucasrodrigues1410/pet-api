import { ValueObject } from "@/core/domain/entities/value-object";

type SizeValue = "small" | "medium" | "large";
type AgeValue = "puppy" | "adult" | "senior";
type CoatValue = "short" | "medium" | "long" | "curly";
type DiseasesValue = "none" | "heart" | "skin" | "orthopedic";

type Operator = "eq" | "neq";
type Characteristic = "size" | "age" | "coat" | "diseases";
type Value = SizeValue | AgeValue | CoatValue | DiseasesValue;

export interface RulesProps {
	characteristic: Characteristic;
	options: {
		value: Value | Value[];
		operator: Operator;
		price: number;
		time?: number;
	}[];
}

export class Rules extends ValueObject<RulesProps> {
	get characteristic() {
		return this.props.characteristic;
	}

	get options() {
		return this.props.options;
	}

	static empty(): Rules {
		return new Rules({ characteristic: "size", options: [] });
	}

	static create(props?: RulesProps): Rules {
		if (!props) {
			return Rules.empty();
		}
		return new Rules(props);
	}

	public toObject() {
		return {
			characteristic: this.characteristic,
			options: this.options.map((o) => ({
				value: o.value,
				operator: o.operator,
				price: o.price,
				time: o.time,
			})),
		};
	}
}
