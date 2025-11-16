import { google } from "@ai-sdk/google";
import { Injectable } from "@nestjs/common";
import { generateObject } from "ai";
import z from "zod";
import {
	Rules,
	RulesProps,
} from "../../domain/entities/value-objects/rules.value-object";
import { RulesTranslatorRepository } from "../../domain/repositories/rules-translator.repository";

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
								z.enum(["none"]).or(z.string()),
								z.enum(["short", "medium", "long", "curly"]),
							]),
							operator: z.enum(["eq", "neq"]),
							action: z.enum(["deny", "allow", "charge", "discount"]),
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

const SYSTEM_PROMPT = `Parse regras de pet shop em linguagem natural para estrutura JSON. Siga rigorosamente o schema.

CARACTERÍSTICAS E VALORES PERMITIDOS:
- size: "small" | "medium" | "large"
- age: "puppy" | "adult" | "senior"
- diseases: "none" | "string"
- coat: "short" | "medium" | "long" | "curly"

CAMPOS OBRIGATÓRIOS:
- operator: "eq" (igual) | "neq" (diferente)
- action: "deny" | "allow" | "charge" | "discount"
- price: número (negativo para desconto)
- time: minutos adicionais (opcional)

MAPEAMENTO ACTION:
- deny: bloqueio/proibição → palavras-chave: "não atender", "bloquear", "negar", "não aceitar", "não autorizar", "recusar", "proibido", "excluir"
- allow: liberação explícita → palavras-chave: "apenas", "permitir", "aceitar", "autorizar", "liberar", "somente"
- charge/discount: preço/desconto → use se nenhuma palavra-chave de deny/allow aparecer

REGRAS DE PARSING:
1. Agrupe por "characteristic"
2. Uma "option" por variação dentro da característica
3. Ignore características não listadas
4. Retorne array vazio se não houver regras claras
5. Não infira dados não explícitos
6. Para negações: operator "neq" + action "deny"

EXEMPLOS:
1. "Cobrar R$15 + 30min para cães médios"
   → [{"characteristic":"size","options":[{"value":"medium","operator":"eq","action":"charge","price":15,"time":30}]}]

2. "Negar cães com doença cardíaca"
   → [{"characteristic":"diseases","options":[{"value":"heart","operator":"eq","action":"deny","price":0}]}]

3. "Desconto R$10 sem doenças; negar idosos"
   → [
       {"characteristic":"diseases","options":[{"value":"none","operator":"eq","action":"discount","price":-10}]},
       {"characteristic":"age","options":[{"value":"senior","operator":"eq","action":"deny","price":0}]}
     ]

4. "Permitir apenas pelagem curta/média; cobrar R$20 para grande"
   → [
       {"characteristic":"coat","options":[{"value":"short","operator":"eq","action":"allow","price":0},{"value":"medium","operator":"eq","action":"allow","price":0}]},
       {"characteristic":"size","options":[{"value":"large","operator":"eq","action":"charge","price":20}]}
     ]
`;
