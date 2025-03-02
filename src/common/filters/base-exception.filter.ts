import { ExceptionFilter, Catch, ArgumentsHost } from "@nestjs/common";
import { ErrorResponseDto } from "../dto/error-response.dto";

@Catch()
export abstract class BaseExceptionFilter implements ExceptionFilter {
	abstract getErrorResponse(exception: unknown): ErrorResponseDto;

	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse();
		const errorResponse = this.getErrorResponse(exception);

		response.status(errorResponse.statusCode).json(errorResponse);
	}
}
