import { Inject, Injectable } from "@nestjs/common";
import { IUserRepository } from "src/modules/user/domain/repositories/user.repository";
import { TokenGeneratorService } from "../../infrastructure/services/token-generator.service";
import { IPasswordHasher } from "../../domain/interfaces/password-hasher.interface";
import { InvalidCredentialsException } from "../../domain/exception/invalid-credentials.exception";

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
		const isPasswordValid = await this.passwordHasher.comparePassword(
			body.password,
			user?.password ?? "",
		);

		if (!user || !isPasswordValid) {
			throw new InvalidCredentialsException();
		}

		const accessToken = this.tokenGeneratorSevice.generateToken({
			id: user.id,
			email: user.email,
			name: user.name ?? "",
			type: user.type
		});

		return {
			access_token: accessToken,
		};
	}
}
