import { Injectable } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { User } from "src/modules/user/domain/entities/user.entity";
import { UserRepository } from "src/modules/user/domain/repositories/user.repository";
import { SendUserCreatedNotificationCommand } from "@/modules/notification/application/commands/send-user-created.handler";
import { Either, left, right } from "@/shared/either";
import { UserAlreadyExistError } from "../../domain/errors/user-already-exists.error";
import { HashGenerator } from "../../domain/interfaces/hash-generator.interface";

interface SignUpUseCaseRequest {
	name: string;
	email: string;
	password: string;
}
type SignUpUseCaseResponse = Either<UserAlreadyExistError, { user: User }>;

@Injectable()
export class SignUpUseCase {
	constructor(
		private readonly userRepository: UserRepository,
		private hashGenerator: HashGenerator,
		private readonly commandBus: CommandBus,
	) {}

	async execute({
		name,
		email,
		password,
	}: SignUpUseCaseRequest): Promise<SignUpUseCaseResponse> {
		const userWithSameEmail = await this.userRepository.findByEmail(email);

		if (userWithSameEmail) {
			return left(new UserAlreadyExistError(email));
		}

		const hashedPassword = await this.hashGenerator.hash(password);

		const user = User.create({
			name,
			email,
			type: "customer",
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
		return right({ user });
	}
}
