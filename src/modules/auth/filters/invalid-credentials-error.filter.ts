import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { InvalidCredentialsError } from "../../../common/exceptions/invalid-credentials.exception";

@Catch(InvalidCredentialsError)
export class InvalidCredentialsErrorFilter implements ExceptionFilter {
  catch(exception: InvalidCredentialsError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    response.status(401).json({
      statusCode: 401,
      message: "Invalid credentials",
    });
  }
}