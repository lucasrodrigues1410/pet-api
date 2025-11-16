import { Injectable } from "@nestjs/common";
import { Animal } from "@/modules/animal/domain/entities/animal.entity";
import { Rules } from "@/modules/service/domain/entities/value-objects/rules.value-object";

type CalculateResult =
	| { price: number; durationMinutes: number }
	| { action: "deny" };

@Injectable()
export class RulesExecutionService {
	execute(
		animal: Animal,
		rules?: Rules[],
		disease?: string,
		coatType?: string,
	): CalculateResult {
		if (!rules?.length) return { price: 0, durationMinutes: 0 };

		const characteristics = {
			size: animal.size,
			age: animal.ageStage,
			diseases: disease,
			coat: coatType,
		};

		let price = 0;
		let durationMinutes = 0;

		for (const rule of rules) {
			const actualValue =
				characteristics[rule.characteristic as keyof typeof characteristics];
			if (!actualValue) continue;

			const matchedOption = rule.options.find((option) =>
				this.matches(option.value, actualValue, option.operator),
			);

			if (!matchedOption) continue;
			if (matchedOption.action === "deny") return { action: "deny" };

			price = matchedOption.price * 100;
			durationMinutes += matchedOption.time || 0;
		}
		return { price, durationMinutes };
	}

	private matches(
		optionValue: string | string[],
		actualValue: string,
		operator: string,
	): boolean {
		const values = Array.isArray(optionValue) ? optionValue : [optionValue];
		const isEquals = operator === "eq";
		const isPresent = values.includes(actualValue);

		return isEquals ? isPresent : !isPresent;
	}
}
