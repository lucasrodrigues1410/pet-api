import { z } from "zod";

/*
const SizeValueSchema = z.enum(["small", "medium", "large"]);
const AgeValueSchema = z.enum(["puppy", "adult", "senior"]);
const CoatValueSchema = z.enum(["short", "medium", "long", "curly"]);
const DiseasesValueSchema = z.enum(["none", "heart", "skin", "orthopedic"]);
*/
const OperatorSchema = z.enum(["eq", "neq"]);
const CharacteristicSchema = z.enum(["size", "age", "coat", "diseases"]);

/*const rulesValueDto = z.union([
  SizeValueSchema,
  AgeValueSchema,
  CoatValueSchema,
  DiseasesValueSchema
]);*/

const rulesOptionDto = z.object({
	value: z.union([z.string(), z.array(z.string())]),
	operator: OperatorSchema,
	price: z.number(),
	time: z.number().optional(),
});

export const rulesDto = z.object({
	characteristic: CharacteristicSchema,
	options: z.array(rulesOptionDto),
});
