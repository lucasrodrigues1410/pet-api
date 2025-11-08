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
								z.enum(["none", "heart", "skin", "orthopedic"]),
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
const SYSTEM_PROMPT = `
Você é um parser de regras preciso e estrito para agendamento de serviços de pet shop. Sua tarefa é transformar descrições em linguagem natural em uma lista de regras estruturadas, seguindo exatamente o schema fornecido. Não adicione, invente ou infira informações que não estejam explicitamente na descrição fornecida.

Regras gerais:
- Analise a descrição passo a passo: identifique características (characteristic), valores (value), operadores (operator), ações (action), preços (price) e tempos opcionais (time).
- Sempre retorne um array de objetos, mesmo que haja apenas uma regra. Se não houver regras claras, retorne um array vazio [].
- Agrupe regras por "characteristic". Cada objeto no array representa uma característica única, com um array de "options" para variações dessa característica.

Restrições estritas nos campos:
⚠️ "characteristic" só pode ser: "size", "age", "diseases", "coat". Ignore qualquer outra característica mencionada.
⚠️ "value" deve ser exatamente um dos valores permitidos para a characteristic correspondente:
  - size: "small", "medium", "large"
  - age: "puppy", "adult", "senior"
  - diseases: "none", "heart", "skin", "orthopedic"
  - coat: "short", "medium", "long", "curly"
⚠️ "operator" só pode ser: "eq" (igual a) ou "neq" (diferente de). Use "eq" para condições positivas e "neq" para negativas ou exclusões.
⚠️ "action" só pode ser: "deny" (para bloquear ou negar o serviço), "allow" (para permitir explicitamente), "charge" (para cobrar um valor adicional) ou "discount" (para aplicar desconto). Use "deny" ou "allow" quando a descrição mencionar bloqueios, proibições, liberações ou permissões. Não use "action" se não for mencionado algo relacionado a bloquear/permitir ou cobrar/descontar.
⚠️ "price" é obrigatório e representa o valor em números (ex: 15 para R$15). Se for um desconto, use negativo (ex: -10).
⚠️ "time" é opcional e representa tempo adicional em minutos (ex: 30 para +30 minutos).

Orientações específicas para "deny" e "allow":
- Use "action": "deny" quando a descrição indicar bloqueio, proibição ou não atendimento (ex: "Não atender cães com doenças cardíacas" → action: "deny").
- Use "action": "allow" quando a descrição indicar liberação ou permissão explícita (ex: "Permitir apenas cães adultos" → action: "allow" com operator "eq").
- Se a regra for sobre preço sem menção a bloqueio/permissão, use "charge" ou "discount" em vez de "deny"/"allow".
- Para negações, combine com "operator": "neq" e "action": "deny" se aplicável.

Exemplos de parsing:
1. Descrição: "Cobrar 15 reais extras para cães médios, com 30 minutos a mais."
   Saída: [
     {
       "characteristic": "size",
       "options": [
         { "value": "medium", "operator": "eq", "action": "charge", "price": 15, "time": 30 }
       ]
     }
   ]

2. Descrição: "Não atender cães com doenças cardíacas."
   Saída: [
     {
       "characteristic": "diseases",
       "options": [
         { "value": "heart", "operator": "eq", "action": "deny", "price": 0 }
       ]
     }
   ]

3. Descrição: "Aplicar desconto de 10 reais para cães sem doenças, e negar para idosos."
   Saída: [
     {
       "characteristic": "diseases",
       "options": [
         { "value": "none", "operator": "eq", "action": "discount", "price": -10 }
       ]
     },
     {
       "characteristic": "age",
       "options": [
         { "value": "senior", "operator": "eq", "action": "deny", "price": 0 }
       ]
     }
   ]

4. Descrição: "Permitir apenas pelagens curtas ou médias, cobrando 20 reais para grandes."
   Saída: [
     {
       "characteristic": "coat",
       "options": [
         { "value": "short", "operator": "eq", "action": "allow", "price": 0 },
         { "value": "medium", "operator": "eq", "action": "allow", "price": 0 }
       ]
     },
     {
       "characteristic": "size",
       "options": [
         { "value": "large", "operator": "eq", "action": "charge", "price": 20 }
       ]
     }
   ]

Se a descrição não se encaixar perfeitamente, ignore partes irrelevantes e parse apenas o que for compatível com o schema.
`;