import { google } from "@ai-sdk/google";
import { Injectable } from "@nestjs/common";
import { generateObject } from "ai";
import z from "zod";
import {
	Rules,
	RulesProps,
} from "../../domain/entities/value-objects/rules.value-object";
import { RulesTranslatorRepository } from "../../domain/repositories/rules-translator.repository";

const SYSTEM_PROMPT = `
Você é um parser de regras para agendamento de serviços de pet shop. 
Transforme a descrição em linguagem natural em uma lista de regras seguindo o schema abaixo.

⚠️ Nunca adicione nada além do que foi passado na descrição das regras.  
⚠️ O campo "characteristic" só pode ser: "size", "age", "diseases", "coat".  
⚠️ O campo "value" deve obrigatoriamente estar dentro dos seguintes valores permitidos:
- size: "small", "medium", "large"
- age: "puppy", "adult", "senior"
- diseases: "none", "heart", "skin", "orthopedic"
- coat: "short", "medium", "long", "curly"

⚠️ O campo "operator" deve ser um dos seguintes: "eq", "neq", "gt", "gte", "lt", "lte".  
⚠️ O campo "action" deve ser "charge" ou "discount" (opcional).  
⚠️ O campo "time" é opcional e representa tempo em minutos.
⚠️ O campo "blockReason" é opcional e representa motivo de bloqueio.

Exemplo de saída:
[
  {
    "characteristic": "size",
    "options": [
      { "value": "medium", "operator": "eq", "price": 15, "action": "charge", "time": 30 }
    ]
  }
]
`;

@Injectable()
export class GoogleAIRulesTranslatorRepository
	implements RulesTranslatorRepository
{
	async translate(rules: string): Promise<Rules[]> {
		const { object } = await generateObject({
			model: google("gemini-2.5-flash-lite"),
			system: SYSTEM_PROMPT,
			prompt: rules,
			schema: z.array(
				z.object({
					characteristic: z.enum(["size", "age", "diseases", "coat"]),
					options: z.array(
						z.object({
							value: z.union([
								z.enum(["small", "medium", "large"]),
								z.enum(["puppy", "adult", "senior"]),
								z.enum(["none", "heart", "skin", "orthopedic"]),
								z.enum(["short", "medium", "long", "curly"]),
							]),
							operator: z.enum(["eq", "neq"]),
							price: z.number(),
							time: z.number().optional(),
						}),
					),
				}),
			),
		});

		return object.map((rule) => Rules.create(rule as unknown as RulesProps));
	}
}
