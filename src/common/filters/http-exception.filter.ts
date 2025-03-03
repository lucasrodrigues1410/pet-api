import { Catch, HttpException } from "@nestjs/common";
import { BaseExceptionFilter } from "./base-exception.filter";
import { ErrorResponseDto } from "../dto/error-response.dto";

@Catch(HttpException)
export class HttpExceptionFilter extends BaseExceptionFilter {
	getErrorResponse(exception: HttpException): ErrorResponseDto {
		const status = exception.getStatus();
		const message = exception.message;

		return {
			statusCode: status,
			message,
		};
	}
}
