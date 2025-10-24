import { Injectable } from "@nestjs/common";
import { UniqueEntityID } from "@/core/domain/entities/unique-entity-id";
import { User } from "@/modules/user/domain/entities/user.entity";
import { UserRepository } from "@/modules/user/domain/repositories/user.repository";
import { Either, right } from "@/shared/either";

type CreateOrUpdateUserFromExternalRequest = {
	authProviderId: string;
	email: string;
	name: string;
	avatarUrl?: string;
};

type CreateOrUpdateUserFromExternalResponse = Either<Error, { id: string }>;

@Injectable()
export class CreateOrUpdateUserFromExternalUseCase {
	constructor(private readonly userRepository: UserRepository) {}

	async execute(
		input: CreateOrUpdateUserFromExternalRequest,
	): Promise<CreateOrUpdateUserFromExternalResponse> {
		const { authProviderId, email, name, avatarUrl } = input;

		const existingByEmail = await this.userRepository.findByEmail(email);

		if (existingByEmail) {
			await this.userRepository.update(existingByEmail.id.toString(), {
				name: name,
				avatarUrl: avatarUrl,
				authProviderId,
			});
			return right({ id: existingByEmail.id.toString() });
		}

		const user = User.create(
			{ name: name, email, authProviderId, avatarUrl },
			new UniqueEntityID(),
		);

		await this.userRepository.create(user);
		return right({ id: user.id.toString() });
	}
}
