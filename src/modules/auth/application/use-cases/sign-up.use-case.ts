import { Injectable } from "@nestjs/common";
import { User } from "src/modules/user/domain/entities/user.entity";
import { UserRepository } from "src/modules/user/domain/repositories/user.repository";
import { WelcomeEvent } from "@/modules/notification/domain/events/welcome.event";
import { NotificationPublisher } from "@/modules/notification/domain/interfaces/notification-publisher.interface";
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
		private readonly notifyPublisher: NotificationPublisher,
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
		await this.notifyPublisher.dispatch(
			new WelcomeEvent(user.id.toString(), {
				name: user.name,
				email: user.email,
			}),
		);
		return right({ user });
	}
}
