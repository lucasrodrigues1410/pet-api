import { Catch, BadRequestException, HttpStatus } from "@nestjs/common";
import { ValidationError } from "class-validator";
import { BaseExceptionFilter } from "./base-exception.filter";
import { ErrorResponseDto } from "../dto/error-response.dto";

interface ValidationErrorResponseObject {
	message: (string | ValidationError)[];
	error?: string;
}

@Catch(BadRequestException)
export class ValidationExceptionFilter extends BaseExceptionFilter {
	getErrorResponse(exception: BadRequestException): ErrorResponseDto {
		const exceptionResponse = exception.getResponse() as ValidationError[];
		const status = 422;

		let formattedErrors: Record<string, string[]> | undefined;

		if (
			typeof exceptionResponse === "object" &&
			exceptionResponse !== null &&
			"message" in exceptionResponse
		) {
			const validationResponse =
				exceptionResponse as ValidationErrorResponseObject;

			if (Array.isArray(validationResponse.message)) {
				if (
					validationResponse.message.length > 0 &&
					typeof validationResponse.message[0] === "object" &&
					validationResponse.message[0] !== null
				) {
					const validationErrors =
						validationResponse.message as ValidationError[];
					formattedErrors = validationErrors.reduce(
						(acc: Record<string, string[]>, error) => {
							acc[error.property] = error.constraints
								? Object.values(error.constraints)
								: [];
							return acc;
						},
						{},
					);
				} else {
					formattedErrors = { general: validationResponse.message as string[] };
				}
			}
		}

		return {
			statusCode: status,
			message: "Erro de validação",
			errors: formattedErrors || exceptionResponse,
		};
	}
}
