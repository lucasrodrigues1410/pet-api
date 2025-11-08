import { z } from "zod";

const optionsDefinition = z.object({
	operator: z.string(),
	price: z.number(),
	time: z.number().optional(),
	action: z.enum(["deny", "allow"]).optional(),
});

const sizeRulesDto = z.object({
	characteristic: z.literal("size"),
	options: z
		.object({
			value: z.enum(["small", "medium", "large"]),
			...optionsDefinition.shape,	
		})
		.array(),
});

const ageRulesDto = z.object({
	characteristic: z.literal("age"),
	options: z
		.object({
			value: z.enum(["puppy", "adult", "senior"]),
			...optionsDefinition.shape,
		})
		.array(),
});

const coatRulesDto = z.object({
	characteristic: z.literal("coat"),
	options: z
		.object({
			value: z.enum(["short", "medium", "long", "curly"]),
			...optionsDefinition.shape,
		})
		.array(),
});

const diseasesRulesDto = z.object({
	characteristic: z.literal("diseases"),
	options: z
		.object({
			value: z.enum(["heart", "skin", "orthopedic", "diabetes", "none"]),
			...optionsDefinition.shape,
		})
		.array(),
});

export const rulesDto = z.discriminatedUnion("characteristic", [
	sizeRulesDto,
	ageRulesDto,
	coatRulesDto,
	diseasesRulesDto,
]);

export type RulesDto = z.infer<typeof rulesDto>;
export type SizeRulesDto = z.infer<typeof sizeRulesDto>;
export type AgeRulesDto = z.infer<typeof ageRulesDto>;
export type CoatRulesDto = z.infer<typeof coatRulesDto>;
export type DiseasesRulesDto = z.infer<typeof diseasesRulesDto>;