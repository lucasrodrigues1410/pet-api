import { Injectable } from "@nestjs/common";
import { UserRepository } from "src/modules/user/domain/repositories/user.repository";
import { InvalidCredentialsError } from "../errors/invalid-credentials.error";
import { Either, left, right } from "src/common/either";
import { HashComparer } from "../../domain/interfaces/hash-comparer.interface";
import { Encrypter } from "../../domain/interfaces/encrypter.interface";

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
		private hashComparer: HashComparer,
		private encrypter: Encrypter,
	) {}

	async execute({
		email,
		password,
	}: LoginUseCaseRequest): Promise<LoginUseCaseResponse> {
		const user = await this.userRepository.findByEmail(email);

		if (!user) {
			return left(new InvalidCredentialsError());
		}

		const isPasswordValid = await this.hashComparer.compare(
			password,
			user?.password,
		);

		if (!isPasswordValid) {
			return left(new InvalidCredentialsError());
		}

		const accessToken = await this.encrypter.encrypt({
			sub: user.id,
			name: user.name,
			email: user.email,
			type: user.type,
		});
		return right({ accessToken });
	}
}
