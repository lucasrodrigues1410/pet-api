import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
	UseFilters,
} from "@nestjs/common";
import { LoginDto } from "../dtos/login.dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { LoginUseCase } from "../../application/use-cases/login.use-case";
import { InvalidCredentialsExceptionFilter } from "../filters/invalid-credentials-exception.filter";
import { RegisterUseCase } from "../../application/use-cases/register.use-case";
import { RegisterDto } from "../dtos/register.dto";
import { Public } from "../decorators/public.decorator";

@ApiTags("Autenticação")
@Controller("auth")
@UseFilters(new InvalidCredentialsExceptionFilter())
export class AuthController {
	constructor(
		private loginUseCase: LoginUseCase,
		private registerUseCase: RegisterUseCase,
	) {}

	@ApiOperation({ summary: "Login de usuário" })
	@ApiResponse({ status: 200, description: "Usuário autenticado com sucesso" })
	@ApiResponse({ status: 401, description: "Credenciais inválidas" })
	@Post("login")
    @Public()
	@HttpCode(HttpStatus.OK)
	login(@Body() body: LoginDto) {
		return this.loginUseCase.execute(body);
	}

	@ApiOperation({ summary: "Registro de usuário" })
	@ApiResponse({ status: 201, description: "Usuário registrado com sucesso" })
	@ApiResponse({ status: 400, description: "Erro ao registrar usuário" })
	@Post("register")
    @Public()
	@HttpCode(HttpStatus.CREATED)
	register(@Body() body: RegisterDto) {
		return this.registerUseCase.execute(body);
	}
}
