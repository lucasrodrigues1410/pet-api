import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { InvalidCredentialsExceptionFilter } from '../filters/invalid-credentials-exception.filter';

@ApiTags("Autenticação")
@Controller('auth')
@UseFilters(new InvalidCredentialsExceptionFilter())
export class AuthController {

    constructor(private loginUseCase: LoginUseCase) {}

    @ApiOperation({ summary: 'Login de usuário' })
    @ApiResponse({ status: 200, description: 'Usuário autenticado com sucesso' })
    @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
    @Post('login')
    login(@Body() body: LoginDto) {
        return this.loginUseCase.execute(body);
    }
}
