import { Controller, Get, Param } from "@nestjs/common";
import { FindUserByIdUseCase } from "../../application/use-cases/find-user-by-id.use-case";
import { User, UserType } from "../../domain/entities/user.entity";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserTypeDecorator } from "src/modules/auth/presentation/decorators/user-type.decorator";

@ApiTags("Usuários")
@Controller('users')
export class UserController {
    constructor(private readonly findUserByIdUseCase: FindUserByIdUseCase) {}

    @ApiOperation({ summary: 'Buscar usuário por ID' })
    @UserTypeDecorator(UserType.CUSTOMER)
    @Get(':id')
    async getUser(@Param('id') id: number): Promise<User> {
        return this.findUserByIdUseCase.execute(id);
    }
}