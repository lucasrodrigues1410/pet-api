import { ValueObject } from "@/core/domain/entities/value-object";

type BaseOption = {
  operator: string;
  price: number;
  time?: number;
  action?: "deny" | "allow" | "charge" | "discount";
};

type SizeOption = BaseOption & {
  value: "small" | "medium" | "large";
};

type AgeOption = BaseOption & {
  value: "puppy" | "adult" | "senior";
};

type CoatOption = BaseOption & {
  value: "short" | "medium" | "long" | "curly";
};

type DiseasesOption = BaseOption & {
  value: "none" | "heart" | "skin" | "orthopedic";
};

export interface SizeRulesDto {
  characteristic: "size";
  options: SizeOption[];
}

export interface AgeRulesDto {
  characteristic: "age";
  options: AgeOption[];
}

export interface CoatRulesDto {
  characteristic: "coat";
  options: CoatOption[];
}

export interface DiseasesRulesDto {
  characteristic: "diseases";
  options: DiseasesOption[];
}

export type RulesProps =
  | SizeRulesDto
  | AgeRulesDto
  | CoatRulesDto
  | DiseasesRulesDto;

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
				action: o.action,
			})),
		};
	}
}
