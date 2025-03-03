import { Inject, Injectable } from "@nestjs/common";
import { UserRepository } from "src/modules/user/domain/repositories/user.repository";
import { TokenGeneratorService } from "../../infrastructure/services/token-generator.service";
import { IPasswordHasher } from "../../domain/interfaces/password-hasher.interface";
import { InvalidCredentialsError } from "../errors/invalid-credentials.error";
import { Either, left, right } from "src/common/either";

interface LoginUseCaseRequest {
	email: string;
	password: string;
}

type LoginUseCaseResponse = Either<
	InvalidCredentialsError,
	{
		accessToken: string;
	}
>;

@Injectable()
export class LoginUseCase {
	constructor(
		private readonly userRepository: UserRepository,
		@Inject("ITokenGenerator")
		private readonly tokenGeneratorSevice: TokenGeneratorService,
		@Inject("IPasswordHasher")
		private readonly passwordHasher: IPasswordHasher,
	) {}

	async execute({
		email,password
	}: LoginUseCaseRequest): Promise<LoginUseCaseResponse> {
		const user = await this.userRepository.findByEmail(email);

		if (!user) {
			return left(new InvalidCredentialsError());
		}

		const isPasswordValid = await this.passwordHasher.comparePassword(
			password,
			user?.password,
		);

		if (!isPasswordValid) {
			return left(new InvalidCredentialsError());
		}

		const accessToken = this.tokenGeneratorSevice.generateToken(user);
		return right({ accessToken });
	}
}
