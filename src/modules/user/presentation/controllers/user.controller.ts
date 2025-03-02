import { Controller, Get, Param } from "@nestjs/common";
import { FindUserByIdUseCase } from "../../application/use-cases/find-user-by-id.use-case";
import { User } from "../../domain/entities/user.entity";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags("Usuários")
@Controller('users')
export class UserController {
    constructor(private readonly findUserByIdUseCase: FindUserByIdUseCase) {}

    @ApiOperation({ summary: 'Buscar usuário por ID' })
    @Get(':id')
    async getUser(@Param('id') id: number): Promise<User> {
        return this.findUserByIdUseCase.execute(id);
    }
}