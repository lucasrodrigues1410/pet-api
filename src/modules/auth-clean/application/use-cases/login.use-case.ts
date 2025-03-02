import { Inject, Injectable } from "@nestjs/common";
import { InvalidCredentialsError } from "src/common/exceptions/invalid-credentials.exception";
import { IUserRepository } from "src/modules/user/domain/repositories/user.repository";
import { TokenGeneratorService } from "../../infrastructure/services/token-generator.service";
import { IPasswordHasher } from "../../domain/interfaces/password-hasher.interface";

@Injectable()
export class LoginUseCase {
	constructor(
		private readonly userRepository: IUserRepository,
		@Inject("ITokenGenerator")
		private readonly tokenGeneratorSevice: TokenGeneratorService,
		@Inject("IPasswordHasher")
		private readonly passwordHasher: IPasswordHasher,
	) {}

	async execute(body: { email: string; password: string }) {
		const user = await this.userRepository.findUserByEmail(body.email);
		const isPasswordValid = this.passwordHasher.comparePassword(
			body.password,
			user?.password ?? "",
		);

		if (!user || !isPasswordValid) {
			throw new InvalidCredentialsError();
		}

		const accessToken = this.tokenGeneratorSevice.generateToken({
			id: user.id,
			email: user.email,
			name: user.name ?? "",
		});

		return {
			access_token: accessToken,
		};
	}
}
