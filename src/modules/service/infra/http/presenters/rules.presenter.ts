import { Rules } from "@/modules/service/domain/entities/value-objects/rules.value-object";

export class RulesPresenter {
	static present(rule: Rules) {
		return {
			characteristic: rule.characteristic,
			options: rule.options.map((option) => ({
				value: option.value,
				operator: option.operator,
				price: option.price,
				time: option.time,
			})),
		};
	}
}
