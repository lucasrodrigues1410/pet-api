import { Injectable } from "@nestjs/common";
import { Rules } from "../../domain/entities/value-objects/rules.value-object";
import { RulesTranslatorRepository } from "../../domain/repositories/rules-translator.repository";

interface ServiceInput {
	rules: string;
}

type ServiceOutput = Rules[];

@Injectable()
export class TranslateRulesService {
	constructor(
		private readonly rulesTranslatorRepository: RulesTranslatorRepository,
	) {}

	async execute({ rules }: ServiceInput): Promise<ServiceOutput> {
		return this.rulesTranslatorRepository.translate(rules);
	}
}
