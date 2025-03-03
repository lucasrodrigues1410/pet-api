import { UserType } from "src/modules/user/domain/entities/user.entity";
import { TokenGeneratorService } from "../../infrastructure/security/token-generator.service";
import { Inject } from "@nestjs/common";

interface AuthenticatedUser {
	id: number;
	name: string;
	email: string;
	type: UserType;
}

export class VerifyTokenUseCase {
	constructor(
		@Inject("ITokenGenerator")
		private readonly tokenService: TokenGeneratorService,
	) {}

	async execute(token: string): Promise<AuthenticatedUser | null> {
		return this.tokenService.verifyToken(token);
	}
}
