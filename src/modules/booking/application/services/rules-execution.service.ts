import { Injectable } from "@nestjs/common";
import { Animal } from "@/modules/animal/domain/entities/animal.entity";
import { Rules } from "@/modules/service/domain/entities/value-objects/rules.value-object";

type CalculateResult = { price: number; durationMinutes: number };
type AnimalCharacteristic = string | undefined | null;
type CharacteristicValue = string | string[];

enum Operator {
	EQUALS = "eq",
	NOT_EQUALS = "neq",
}

@Injectable()
export class RulesExecutionService {
	execute(animal: Animal, rules?: Rules[]): CalculateResult | null {
		if (!rules || rules.length === 0) return null;

		const animalValues = this.buildCharacteristicsMap(animal);
		for (const rule of rules) {
			const actualValues = animalValues.get(rule.characteristic);
			if (!actualValues || actualValues.length === 0) continue;

			const matchedOption = this.findMatchingOption(rule.options, actualValues);
			if (matchedOption) {
				if(matchedOption.action === 'deny') {
					throw new Error(`Serviço indisponível para o animal com as características informadas.`)
				}
				// Se a ação for "allow", continua a execução
				return {
					price: matchedOption.price * 100, // Convertendo para centavos
					durationMinutes: matchedOption.time ?? 0,
				};
			}
		}

		return null;
	}

	private buildCharacteristicsMap(
		animal: Animal,
	): Map<string, AnimalCharacteristic[]> {
		return new Map([
			["size", [animal.size]],
			["age", [animal.ageStage]],
		]);
	}

	private findMatchingOption(
		options: Rules["options"],
		actualValues: AnimalCharacteristic[],
	): Rules["options"][number] | undefined {
		return options.find((option) => this.evaluateOption(option, actualValues));
	}

	private evaluateOption(
		option: Rules["options"][number],
		actualValues: AnimalCharacteristic[],
	): boolean {
		const { value, operator } = option;

		// Garante que temos valores válidos para comparar
		const cleanValues = actualValues.filter(
			(v): v is string => v !== null && v !== undefined,
		);

		if (cleanValues.length === 0) return false;

		// Normaliza o valor da opção para sempre ser um array
		const optionValues = Array.isArray(value) ? value : [value];

		return this.matchesOperator(optionValues, cleanValues, operator);
	}

	private matchesOperator(
		optionValues: CharacteristicValue[],
		actualValues: string[],
		operator: string,
	): boolean {
		const isEquals = operator === Operator.EQUALS;

		// Para operador "eq": retorna true se ALGUM valor da opção está presente
		// Para operador "neq": retorna true se ALGUM valor da opção NÃO está presente
		return optionValues.some((optValue) => {
			const isPresent = actualValues.includes(optValue as string);
			return isEquals ? isPresent : !isPresent;
		});
	}
}
