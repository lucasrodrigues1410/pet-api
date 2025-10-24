import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";


@ApiTags("Usuários")
@Controller("users")
export class UserController {
}
