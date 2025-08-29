export abstract class RulesTranslatorRepository {
	abstract translate(rules: string): Promise<Rules[]>;
}
