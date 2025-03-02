import { IsInt, IsOptional, IsString } from "class-validator";

export class ErrorResponseDto {
	@IsInt()
	statusCode: number;

	@IsString()
	message: string;

	@IsString()
	@IsOptional()
	code?: string;

	errors?: unknown
}
