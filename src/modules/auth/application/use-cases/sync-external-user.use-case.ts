import { Injectable } from "@nestjs/common";
import { User } from "@/modules/user/domain/entities/user.entity";
import { UserRepository } from "@/modules/user/domain/repositories/user.repository";
import { Either, right } from "@/shared/either";

type UseCaseInput = {
	authProviderId: string;
	email: string;
	name: string;
	avatarUrl?: string;
};

type UseCaseOutput = Either<Error, { id: string }>;

@Injectable()
export class SyncExternalUserUseCase {
	constructor(private readonly userRepository: UserRepository) {}

	async execute(input: UseCaseInput): Promise<UseCaseOutput> {
		const { authProviderId, email, name, avatarUrl } = input;
		const existingByEmail = await this.userRepository.findByEmail(email);
		let userId: string;

		if (existingByEmail) {
			existingByEmail.update({ name, avatarUrl, email });
			await this.userRepository.update(existingByEmail);
			userId = existingByEmail.id.toString();
		} else {
			const user = User.create({ name, email, authProviderId, avatarUrl });
			await this.userRepository.create(user);
			userId = user.id.toString();
		}

		return right({ id: userId });
	}
}
