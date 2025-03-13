import { Inject, Injectable } from "@nestjs/common";
import { Either, left, right } from "src/core/either";
import { User } from "src/modules/user/domain/entities/user.entity";
import { UserRepository } from "src/modules/user/domain/repositories/user.repository";
import { HashGenerator } from "../../domain/interfaces/hash-generator.interface";
import { UserAlreadyExistError } from "../../domain/errors/user-already-exists.error";

interface LoginUseCaseRequest {
	name: string;
	email: string;
	password: string;
}
type LoginUseCaseResponse = Either<
	UserAlreadyExistError,
	{
		user: User;
	}
>;

@Injectable()
export class RegisterUseCase {
	constructor(
		private readonly userRepository: UserRepository,
		private hashGenerator: HashGenerator,
	) {}

	async execute({
		name,
		email,
		password,
	}: LoginUseCaseRequest): Promise<LoginUseCaseResponse> {
		const userWithSameEmail = await this.userRepository.findByEmail(email);

		if (userWithSameEmail) {
			return left(new UserAlreadyExistError(email));
		}

		const hashedPassword = await this.hashGenerator.hash(password);

		const user = User.create({
			name,
			email,
			type: "CUSTOMER",
			password: hashedPassword,
		});

		await this.userRepository.create(user);

		return right({
			user,
		});
	}
}
