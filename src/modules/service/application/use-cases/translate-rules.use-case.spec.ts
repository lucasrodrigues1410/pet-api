import { Test, TestingModule } from "@nestjs/testing";
import { Rules } from "../../domain/entities/value-objects/rules.value-object";
import { RulesTranslatorRepository } from "../../domain/repositories/rules-translator.repository";
import { TranslateRulesUseCase } from "./translate-rules.use-case";

describe("TranslateRulesUseCase", () => {
	let useCase: TranslateRulesUseCase;
	let mockRulesTranslatorRepository: jest.Mocked<RulesTranslatorRepository>;

	beforeEach(async () => {
		const mockRepository = {
			translate: jest.fn(),
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				TranslateRulesUseCase,
				{
					provide: RulesTranslatorRepository,
					useValue: mockRepository,
				},
			],
		}).compile();

		useCase = module.get<TranslateRulesUseCase>(TranslateRulesUseCase);
		mockRulesTranslatorRepository = module.get(RulesTranslatorRepository);
	});

	it("should be defined", () => {
		expect(useCase).toBeDefined();
	});

	it("should translate rules successfully", async () => {
		const mockRules = "Cobrar R$ 15 para cães de porte médio";
		const expectedResult = [
			Rules.create({
				characteristic: "size",
				options: [
					{
						value: "medium",
						operator: "eq",
						price: 15,
						action: "charge",
					},
				],
			}),
		];

		mockRulesTranslatorRepository.translate.mockResolvedValue(expectedResult);

		const result = await useCase.execute({ rules: mockRules });

		expect(result).toEqual(expectedResult);
		expect(mockRulesTranslatorRepository.translate).toHaveBeenCalledWith(
			mockRules,
		);
	});
});
