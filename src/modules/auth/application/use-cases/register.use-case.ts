import { Either, left, right } from "@/shared/either";
import { Injectable } from "@nestjs/common";
import { User } from "src/modules/user/domain/entities/user.entity";
import { UserRepository } from "src/modules/user/domain/repositories/user.repository";
import { UserAlreadyExistError } from "../../domain/errors/user-already-exists.error";
import { HashGenerator } from "../../domain/interfaces/hash-generator.interface";
import { CommandBus } from "@nestjs/cqrs";
import { SendUserCreatedNotificationCommand } from "@/modules/notification/application/commands/user-created/send-user-created.command";

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
		private readonly commandBus: CommandBus,
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
		await this.commandBus.execute(
			new SendUserCreatedNotificationCommand(
				user.id.toString(),
				user.email,
				user.name,
			),
		);
		return right({
			user,
		});
	}
}
