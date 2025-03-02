import { Catch, NotFoundException } from "@nestjs/common";
import { BaseExceptionFilter } from "./base-exception.filter";
import { ErrorResponseDto } from "../dto/error-response.dto";

@Catch(NotFoundException)
export class NotFoundErrorFilter extends BaseExceptionFilter {
	getErrorResponse(exception: NotFoundException): ErrorResponseDto {
		return {
			statusCode: 404,
			message: exception.message || "Recurso não encontrado",
		};
	}
}
