import { Injectable } from "@nestjs/common";
import { UserRepository } from "src/modules/user/domain/repositories/user.repository";
import { User } from "@/modules/user/domain/entities/user.entity";
import { Either, left, right } from "@/shared/either";
import { InvalidCredentialsError } from "../../domain/errors/invalid-credentials.error";
import { Encrypter } from "../../domain/interfaces/encrypter.interface";
import { HashComparer } from "../../domain/interfaces/hash-comparer.interface";

interface SignInUseCaseRequest {
	email: string;
	password: string;
}

type SignInUseCaseResponse = Either<
	InvalidCredentialsError,
	User & {
		accessToken: string;
	}
>;

@Injectable()
export class SignInUseCase {
	constructor(
		private readonly userRepository: UserRepository,
		private hashComparer: HashComparer,
		private encrypter: Encrypter,
	) {}

	async execute({
		email,
		password,
	}: SignInUseCaseRequest): Promise<SignInUseCaseResponse> {
		const user = await this.userRepository.findByEmail(email);
		const isPasswordValid = await this.hashComparer.compare(
			password,
			user?.password ?? "",
		);

		if (!user || !isPasswordValid || user.type !== "CUSTOMER") {
			return left(new InvalidCredentialsError());
		}

		const accessToken = await this.encrypter.encrypt({
			sub: user.id.toString(),
			name: user.name,
			email: user.email,
			type: user.type,
		});

		return right(Object.assign(user, { accessToken }));
	}
}
