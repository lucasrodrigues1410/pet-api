import { Injectable } from "@nestjs/common";
import { Animal } from "@/modules/animal/domain/entities/animal.entity";
import { Rules } from "@/modules/service/domain/entities/value-objects/rules.value-object";

type CalculateResult = { price: number; durationMinutes: number } | undefined;

@Injectable()
export class RulesExecutionService {
	execute(animal: Animal, rules: Rules[]): CalculateResult {
		const values = new Map<string, (string | undefined | null)[]>([
			["size", [animal.size]],
			["age", [animal.ageStage]],
		]);

		for (const rule of rules) {
			const actual = values.get(rule.characteristic);
			if (actual === undefined) continue;

			for (const option of rule.options) {
				if (!actual) continue;
				if (this.evaluateOption(option, actual)) {
					return {
						price: option.price,
						durationMinutes: option.time ?? 0,
					};
				}
			}
		}

		return undefined;
	}

	private evaluateOption(
		option: Rules["options"][number],
		actual: (string | undefined | null)[],
	): boolean {
		if (Array.isArray(option.value)) {
			if (actual.length === 0) return false;
			return option.value.some((opt) => {
				return option.operator === "eq"
					? actual.includes(opt)
					: !actual.includes(opt);
			});
		}

		return option.operator === "eq"
			? actual.includes(option.value)
			: !actual.includes(option.value);
	}
}
