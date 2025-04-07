import { ZodDto, zodToOpenAPI } from "nestjs-zod";
import { ZodSchema, ZodTypeDef } from "zod";

export function createZodCustomDto<
	TOutput = any,
	TDef extends ZodTypeDef = ZodTypeDef,
	TInput = TOutput,
>(schema: ZodSchema<TOutput, TDef, TInput>) {
	class AugmentedZodDto {
		public static isZodDto = true;
		public static schema = schema;

		public static _OPENAPI_METADATA_FACTORY(): Record<string, any> | undefined {
			return zodToOpenAPI(AugmentedZodDto.schema).properties;
		}

		public static create(input: unknown) {
			return AugmentedZodDto.schema.parse(input);
		}
	}

	return AugmentedZodDto as unknown as ZodDto<TOutput, TDef, TInput>;
}
