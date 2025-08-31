import { Rules } from "../entities/value-objects/rules.value-object";

export abstract class RulesTranslatorRepository {
	abstract translate(rules: string): Promise<Rules[]>;
}
