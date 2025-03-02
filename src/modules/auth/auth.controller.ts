// import { Body, Controller, Post } from '@nestjs/common';
// import { LoginDto } from './dto/login.dto';
// import { AuthService } from './auth.service';
// import { ApiOperation, ApiTags } from '@nestjs/swagger';
// import { RegisterDto } from './dto/register.dto';

// @ApiTags("Autenticação")
// @Controller('auth')
// export class AuthController {

//     constructor(private authService: AuthService) {}

//     @ApiOperation({ summary: 'Login de usuário' })
//     @Post('login')
//     login(@Body() body: LoginDto) {
//         return this.authService.login(body);
//     }

//     @ApiOperation({ summary: 'Registro de usuário' })
//     @Post('register')
//     register(@Body() body: RegisterDto) {
//         return this.authService.register(body);
//     }

// }
