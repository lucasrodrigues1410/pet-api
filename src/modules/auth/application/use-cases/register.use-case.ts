import { ConflictException, Inject, Injectable } from "@nestjs/common";
import { UserRepository } from "src/modules/user/domain/repositories/user.repository";
import { IPasswordHasher } from "../../domain/interfaces/password-hasher.interface";
import { User, UserType } from "src/modules/user/domain/entities/user.entity";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Either, left, right } from "src/common/either";
import { UserAlreadyExistError } from "../errors/user-already-exists.error";

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
		@Inject("IPasswordHasher")
		private readonly passwordHasher: IPasswordHasher,
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

		const hashedPassword = await this.passwordHasher.hashPassword(password);

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
