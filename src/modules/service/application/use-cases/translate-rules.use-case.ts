import { Injectable } from "@nestjs/common";
import { Rules } from "../../domain/entities/value-objects/rules.value-object";
import { RulesTranslatorRepository } from "../../domain/repositories/rules-translator.repository";

interface TranslateRulesUseCaseRequest {
	rules: string;
}

type TranslateRulesUseCaseResponse = Rules[];

@Injectable()
export class TranslateRulesUseCase {
	constructor(
		private readonly rulesTranslatorRepository: RulesTranslatorRepository,
	) {}

	async execute({
		rules,
	}: TranslateRulesUseCaseRequest): Promise<TranslateRulesUseCaseResponse> {
		return this.rulesTranslatorRepository.translate(rules);
	}
}
