import { Catch } from "@nestjs/common";
import { ErrorResponseDto } from "src/common/dto/error-response.dto";
import { InvalidCredentialsException } from "../../domain/exception/invalid-credentials.exception";
import { BaseExceptionFilter } from "src/common/filters/base-exception.filter";

@Catch(InvalidCredentialsException)
export class InvalidCredentialsExceptionFilter extends BaseExceptionFilter {
    getErrorResponse(exception: InvalidCredentialsException): ErrorResponseDto {
        return {
            statusCode: 401,
            message: exception.message,
        };
    }
}
